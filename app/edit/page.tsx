"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useImageStore } from "../../lib/imageStore"
import ImageDiffViewer from "@/components/image-diff-viewer"
import ImageEditSettings from "@/components/image-edit-settings"
import { getStoredImage } from "@/lib/storage"

export default function EditPage() {
  // Redirect when no image was uploaded before
  const router = useRouter()
  useEffect(() => {
    setOriginalUrl(getStoredImage())
    if (!originalUrl) router.replace("/")
  }, [])

  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [editedUrl, setEditedUrl] = useState<string | null>(originalUrl)

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-12">

        { (originalUrl && editedUrl) && ( <ImageDiffViewer
        beforeSrc={originalUrl}
        afterSrc={editedUrl}
        className="col-span-1 h-full lg:col-span-5"
      />) }
     
      <ImageEditSettings />
    </div>
  )
}
