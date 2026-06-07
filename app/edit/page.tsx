"use client"
import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ImageDiffViewer from "@/components/image-diff-viewer"
import ImageEditSettings from "@/components/image-edit-settings"
import { getOriginalImage, storeImage } from "@/lib/storage"
export default function EditPage() {
  const router = useRouter()
  // Redirect when no image was uploaded before
  useEffect(() => {
    const loadImage = async () => {
      const image = await getOriginalImage()
      if (!image) {
        router.replace("/")
        return
      }
      setOriginalImage(image)
      setEditedImage(image)
      // Process Image with default settings on load
      processImage()
    }
    loadImage()
  }, [])

  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [editedImage, setEditedImage] = useState<File | null>(originalImage)

  const [originalImageURL, setOriginalImageURL] = useState<string | null>(null)
  const [editedImageURL, setEditedImageURL] = useState<string | null>(null)

  // Create object URLs for the original and edited images. Revoke old URLs to prevent memory leaks.
  useEffect(() => {
    if (originalImage) {
      URL.revokeObjectURL(originalImageURL || "")
      setOriginalImageURL(URL.createObjectURL(originalImage))
    }
    if (editedImage) {
      URL.revokeObjectURL(editedImageURL || "")
      setEditedImageURL(URL.createObjectURL(editedImage))
    }
  }, [originalImage, editedImage])

  const [settings, setSettings] = useState({
    format: "webp",
    quality: 80,
  })

  const processImage = async () => {
    const originalImage = await getOriginalImage()
    if (!originalImage) return
    setOriginalImage(originalImage)
    console.log("Original image retrieved from indexedDB")

    try {
      const formData = new FormData()
      formData.append("image", originalImage)
      formData.append("settings", JSON.stringify(settings))

      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        console.error("Error processing image")
        return
      }

      const processedImageBlob = await response.blob()
      const mimeType = response.headers.get("Content-Type") || "image/webp"
      const processedImageFile = new File(
        [processedImageBlob],
        "edited-image",
        {
          type: mimeType,
          lastModified: Date.now(),
        }
      )
      setEditedImage(processedImageFile)
      storeImage(originalImage, processedImageFile)
      console.log("Edited image stored in indexedDB")
    } catch (error) {
      console.error("Error processing image")
      return
    }
  }

  // On settings change process the image with new settings. Debounce the processing to prevent too many requests while the user is adjusting the settings.
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const handleSettingsChange = (newSettings: any) => {
    setSettings((settings) => ({ ...settings, ...newSettings }))
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      processImage()
    }, 200)
  }

  return (
    <div className="grid h-screen w-screen grid-cols-1 overflow-hidden lg:grid-cols-3">
      {originalImage && editedImage && (
        <div className="col-span-1 h-full w-full lg:col-span-2">
          <ImageDiffViewer
            beforeSrc={originalImageURL}
            afterSrc={editedImageURL}
            className="h-full w-full"
          />
        </div>
      )}

      <div className="col-span-1 h-full w-full border-l lg:col-span-1">
        <ImageEditSettings
          settings={settings}
          onSettingsChange={handleSettingsChange}
          className="h-full w-full"
        />
      </div>
    </div>
  )
}
