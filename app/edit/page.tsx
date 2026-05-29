"use client"
import React, { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useImageStore } from "../../data/imageStore"

export default function EditPage() {
  const router = useRouter()
  const file = useImageStore((s) => s.file)
  const url = useImageStore((s) => s.url)

  useEffect(() => {
    if (!file) router.replace("/")
  }, [file, router])

  if (!file) return <div className="p-8">No image loaded. Redirecting…</div>

  return (
    <div className="p-8">
      <h1 className="mb-4 text-xl font-semibold"></h1>
      <div style={{ maxWidth: 1024 }}>
        {url ? (
          <Image
            src={url}
            alt="uploaded"
            width={800}
            height={600}
            unoptimized
          />
        ) : (
          <p>Preparing image…</p>
        )}
      </div>
    </div>
  )
}
