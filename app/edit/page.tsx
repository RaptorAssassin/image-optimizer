"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ImageDiffViewer from "@/components/image-diff-viewer"
import ImageEditSettings from "@/components/image-edit-settings"
import { getOriginalImage } from "@/lib/storage"

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

    const formData = new FormData()
    formData.append("image", originalImage)
    formData.append("settings", JSON.stringify(settings))
    try {
      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        console.error("Error processing image")
        return
      }
      const editedImageBlob = await response.blob()
      const editedImageFile = new File([editedImageBlob], "edited-image", {
        type: editedImageBlob.type,
      })
      setEditedImage(editedImageFile)
      console.log("Image processed successfully")
    } catch (error) {
      console.error("Error processing image")
      return
    }
  }

  // On settings change process the image with new settings
  const handleSettingsChange = (newSettings: any) => {
    setSettings((settings) => ({ ...settings, ...newSettings }))
    processImage()
  }

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-12">
      {originalImage && editedImage && (
        <ImageDiffViewer
          beforeSrc={originalImageURL}
          afterSrc={editedImageURL}
          className="col-span-1 h-full lg:col-span-5"
        />
      )}

      <ImageEditSettings
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  )
}
