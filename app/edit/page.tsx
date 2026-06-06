"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ImageDiffViewer from "@/components/image-diff-viewer"
import ImageEditSettings from "@/components/image-edit-settings"
import { getStoredImage } from "@/lib/storage-old"

export default function EditPage() {
  // Redirect when no image was uploaded before
  const router = useRouter()
  useEffect(() => {
    setOriginalImage(getStoredImage())
    if (!originalImage) router.replace("/")
  }, [])

  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [editedImage, setEditedImage] = useState<File | null>(originalImage)

  const [settings, setSettings] = useState({
    format: "webp",
    quality: 80,
  })

  const processImage = async () => {
    const originalImage = getStoredImage()
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

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-12">
      {originalImage && editedImage && (
        <ImageDiffViewer
          beforeSrc={originalImage}
          afterSrc={editedImage}
          className="col-span-1 h-full lg:col-span-5"
        />
      )}

      <ImageEditSettings settings={settings} onSettingsChange={setSettings} />
    </div>
  )
}
