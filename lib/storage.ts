"use client"
import { db } from "../services/db"
import { fileTypeFromBuffer } from "file-type"

export const INPUT_FORMATS = [
  "jpeg",
  "jpg",
  "png",
  "webp",
  "avif",
  "gif",
  "tiff",
  "raw",
  "svg",
] as const
export const OUTPUT_FORMATS = [
  "jpeg",
  "jpg",
  "png",
  "webp",
  "avif",
  "gif",
  "tiff",
  "raw",
] as const

/**
 * Stores the original and edited images in IndexedDB using Dexie.
 * @param originalFile - Uploaded File
 * @param editedFile - If the image has been edited, the edited File. If not provided, the original file will be stored as both original and edited.
 */
export const storeImage = async (originalFile: File, editedFile?: File) => {
  const originalBlob = new Blob([originalFile], { type: originalFile.type })
  const editedBlob = editedFile
    ? new Blob([editedFile], { type: editedFile.type })
    : null

  // TODO: Implement edit history, with random UUIDs for each image, for now only one image is stored with a fixed ID
  //const id = crypto.randomUUID()
  const id = "image"

  try {
    await db.images.put({
      id,
      originalBlob,
      editedBlob: editedBlob || originalBlob,
      editedAt: new Date(),
    })
    console.log(`Stored image in IndexedDB with id "${id}"`)
  } catch (error) {
    console.error("Error storing image in IndexedDB:", error)
  }
}

/**
 * @returns - The stored original image from IndexedDB as a Blob. If no image is found, returns null.
 */
export const getOriginalImage = async () => {
  const image = await db.images.get("image")
  const originalBlob = image?.originalBlob as Blob
  return originalBlob
    ? new File([originalBlob], "image", {
        type: originalBlob.type,
        lastModified: Date.now(),
      })
    : null
}

/**
 * @returns - The stored edited image from IndexedDB as a Blob. If no image is found, returns null.
 */
export const getEditedImage = async () => {
  const image = await db.images.get("image")
  const editedBlob = image?.editedBlob as Blob
  return editedBlob
    ? new File([editedBlob], "image", {
        type: editedBlob.type,
        lastModified: Date.now(),
      })
    : null
}

/**
 * Downloads the edited image.
 */
export const downloadEditedImage = async () => {
  const file = await getEditedImage()
  if (!file) {
    console.error("No edited image found to download.")
    return
  }
  const url = URL.createObjectURL(file)
  const link = document.createElement("a")
  link.href = url
  link.download = "edited-image"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/svg+xml",
]

/**
 * Checks if the provided file is a valid image file by verifying its MIME type and content.
 * @param file - A file to check for validity.
 * @returns A boolean indicating whether the file is a valid image.
 */
export const isValidFile = async (file: File) => {
  if (!file) return false

  // Check file mime type
  if (ALLOWED_MIME_TYPES.includes(file.type)) return true

  // Check file internally
  const buffer = await file.arrayBuffer()
  const type = await fileTypeFromBuffer(buffer)
  if (!type || ALLOWED_MIME_TYPES.includes(type.mime)) return false
  return true
}
