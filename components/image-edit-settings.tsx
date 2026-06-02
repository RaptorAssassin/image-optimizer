"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { INPUT_FORMATS, type InputFormat, useSettingsStore } from "../lib/settingsStore"
import { Slider } from "./ui/slider"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
} from "./ui/combobox"
import { Button } from "./ui/button"
import { useImageStore } from "../lib/imageStore"

interface ImageEditSettingsProps {
  className?: string
}

export default function ImageEditSettings({
  className,
}: ImageEditSettingsProps) {
  const format = useSettingsStore((s) => s.format)
  const setFormat = useSettingsStore((s) => s.setFormat)
  const quality = useSettingsStore((s) => s.quality)
  const setQuality = useSettingsStore((s) => s.setQuality)
  const FILE_FORMAT_LABELS: Record<InputFormat, string> = {
    jpg: "JPG",
    png: "PNG",
    webp: "WebP",
    avif: "AVIF",
    tiff: "TIFF",
    gif: "GIF",
    svg: "SVG",
    heif: "HEIF",
    raw: "RAW",
  }

  const exportImage = () => {
    const { file: workingFile, originalFile } = useImageStore.getState()

    const fileToDownload = workingFile ?? originalFile
    if (!fileToDownload) {
      console.warn("No file available to export")
      return
    }

    const filename = fileToDownload.name ?? originalFile?.name ?? "converted-image"

    const url = URL.createObjectURL(fileToDownload)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const originalFile = useImageStore((s) => s.originalFile)
  const setWorkingFile = useImageStore((s) => s.setWorkingFile)

  const processingTimer = useRef<number | null>(null)
  const DEBOUNCE_MS = 350

  const processImage = useCallback(async () => {
    const orig = originalFile
    if (!orig) return

    try {
      const form = new FormData()
      form.append("file", orig)
      form.append("format", String(format))
      form.append("quality", String(quality))

      const res = await fetch("/api/process-image", {
        method: "POST",
        body: form,
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        console.error("Image processing failed:", res.status, text)
        return
      }

      const blob = await res.blob()
      const ext = format === "jpg" ? "jpg" : format
      const origName = originalFile.name ?? "processed-image"
      const baseName = origName.replace(/\.[^/.]+$/, "")
      const newName = `${baseName}.${ext}`
      const fileToSet = new File([blob], newName, {
        type: blob.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
      })
      setWorkingFile(fileToSet)
    } catch (err) {
      console.error("Error processing image:", err)
    }
  }, [originalFile, format, quality, setWorkingFile])

  useEffect(() => {
    if (!originalFile) return
    if (processingTimer.current) window.clearTimeout(processingTimer.current)
    processingTimer.current = window.setTimeout(() => {
      processingTimer.current = null
      void processImage()
    }, DEBOUNCE_MS)

    return () => {
      if (processingTimer.current) {
        window.clearTimeout(processingTimer.current)
        processingTimer.current = null
      }
    }
  }, [format, quality, originalFile, processImage])

  return (
    <div className={"p-8 " + className}>
      <h1 className="my-4 text-4xl font-bold">Edit Settings</h1>
      <div className="flex flex-col gap-6">
        {/* File format selection combobox */}
        <div>
          <Combobox
            items={INPUT_FORMATS}
            value={format}
            onValueChange={(f) => setFormat(f as InputFormat)}
            itemToStringValue={(f: InputFormat) => FILE_FORMAT_LABELS[f]}
          >
            <ComboboxInput
              placeholder="Select file format"
              onBlur={() => {
                if (processingTimer.current) {
                  window.clearTimeout(processingTimer.current)
                  processingTimer.current = null
                }
                void processImage()
              }}
            />
            <ComboboxContent>
              <ComboboxEmpty>Nothing found.</ComboboxEmpty>
              <ComboboxList>
                {(item: InputFormat) => (
                  <ComboboxItem key={item} value={item}>
                    {FILE_FORMAT_LABELS[item]}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        {/* Quality Slider */}
        <div>
          <label htmlFor="quality" className="text-lg font-medium">
            Quality: {quality}%
          </label>
          <Slider
            id="quality"
            min={0}
            max={100}
            value={[quality]}
            onValueChange={(value) => setQuality(value[0])}
            onBlur={() => {
              if (processingTimer.current) {
                window.clearTimeout(processingTimer.current)
                processingTimer.current = null
              }
              void processImage()
            }}
          />
        </div>
        {/* export button */}
        <Button variant={"default"} onClick={exportImage}>
          Export
        </Button>
      </div>
    </div>
  )
}