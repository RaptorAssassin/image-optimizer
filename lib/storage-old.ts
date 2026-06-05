'use client'
import { fileTypeFromBuffer } from "file-type"
import { useRouter } from "next/navigation"
import { isOnClient } from "./utils"

/**
 * Redirect the user to a specified URL using Next.js router.
 * @param url - The URL to redirect to.
 */
export const redirect = (url: string) => {
  if (!isOnClient()) return
  const router = useRouter()
  router.push(url)
}

/** 
 * Stores the URL of the uploaded image in localStorage.
 * @param originalUrl - The URL of the original uploaded image.
 * @param editedUrl - (Optional) The URL of the edited image, if applicable.
 * If an editedUrl is provided, it also adds the original and edited URLs to the history in localStorage.
 */
export const storeImage = (originalUrl: string, editedUrl?: string) => {
  if (!isOnClient()) return
  // Store the new image in the "current" object in localStorage
  const stored = localStorage.getItem("current")
  const currentObj = stored ? JSON.parse(stored) : {}
  const editedObj = {
    ...currentObj,
    originalUrl,
    editedUrl,
    editedAt: new Date().toISOString(),
  }
  localStorage.setItem("current", JSON.stringify(editedObj))

  // Add to history if the image has been edited
  if (editedUrl) {
    addToHistory(originalUrl, editedUrl)
  }
  console.log("Stored image:", editedObj)
}

/**
 * Adds an edited image to the history in localStorage.
 * @param originalUrl - The original URL of the uploaded image.
 * @param editedUrl - The URL of the edited image.
 */
export const addToHistory = (originalUrl: string, editedUrl: string) => {
  if (!isOnClient()) return
  const stored = localStorage.getItem("history")
  const currentHistory = stored ? JSON.parse(stored) : []
  localStorage.setItem(
    "history",
    JSON.stringify([
      ...currentHistory,
      { originalUrl, editedUrl, editedAt: new Date().toISOString() },
    ])
  )
}

/**
 * Retrieves the URL of the currently stored image from localStorage.
 * @returns The URL of the currently stored image, or null if none is stored.
 */
export const getStoredImage = () => {
  const stored = localStorage.getItem("current")
  const currentObj = stored ? JSON.parse(stored) : null
  if (!currentObj) return null
  return currentObj.originalUrl
}

/**
 * Calls the API route to upload an image to the CDN and returns the URL of the uploaded image.
 * @param file - File to upload to the CDN
 * @returns The Url of the uploaded image.
 * @throws Error when the upload fails.
 */
export const uploadImage = async (file: File) => {
  const response = await fetch("/api/upload", {
    method: "POST",
    body: file,
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to upload image: ${errorText}`)
  }
  const { url } = await response.json()
  return url
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
const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".bmp",
  ".gif",
  ".svg",
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

/**
 * Processes an image file by validating it and uploading it to the CDN.
 * @param file - The file to process
 */
export const processImage = async (file: File) => {
    if (!( await isValidFile(file))) {
        throw new Error("Invalid file")
    }
    const uploadedUrl = await uploadImage(file)
    if (!uploadedUrl) {
        redirect("/")
        throw new Error("Upload failed")
    }
    storeImage(uploadedUrl)
} 