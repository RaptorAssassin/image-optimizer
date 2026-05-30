"use client"
import React, { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useImageStore } from "../../data/imageStore"
import ImageDiffViewer from "@/components/image-diff-viewer"
import ImageEditSettings from "@/components/image-edit-settings"

export default function EditPage() {
  const router = useRouter()
  const file = useImageStore((s) => s.file)
  const url = useImageStore((s) => s.url)

  useEffect(() => {
    if (!file) router.replace("/")
  }, [file, router])

  return url === null ? null : (
    <div className="grid h-full grid-cols-1 lg:grid-cols-12">
      <ImageDiffViewer
        beforeSrc={url}
        afterSrc={"/public/hackerman.png"}
        className="col-span-1 h-full lg:col-span-5"
      />
      <ImageEditSettings />
    </div>
  )
}
