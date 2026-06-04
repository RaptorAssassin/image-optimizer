import { fileTypeFromBuffer } from "file-type"

const isOnClient = () => typeof window !== "undefined"


export const storeImage = (originalUrl: string, editedUrl?: string) => {
  if (!isOnClient) return
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

export const addToHistory = (originalUrl: string, editedUrl: string) => {
  if (!isOnClient) return
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

export const getStoredImage = () => {
  const stored = localStorage.getItem("current")
  const currentObj = stored ? JSON.parse(stored) : null
  if (!currentObj) return null
  return currentObj.originalUrl
}

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch(`${process.env.CDN_API_URL}/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CDN_API_KEY}`, 
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
      return
    }

    const { url } = await response.json()
    return url
  } catch (error) {
    return
  }
}


const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/bmp", "image/gif", "image/svg+xml"]
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".bmp", ".gif", ".svg"]

export const isValidFile = async (file: File) => {
    if (!file) return false

    // Check file mime type
    if (ALLOWED_MIME_TYPES.includes(file.type)) return true
    
    // Check file internally
    const buffer = await file.arrayBuffer();
    const type = await fileTypeFromBuffer(buffer);
    if (!type || ALLOWED_MIME_TYPES.includes(type.mime)) return false
    return true
  }