"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Slider } from "./ui/slider"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
} from "./ui/combobox"
import { Spinner } from "./ui/spinner"
import { Button } from "./ui/button"
import {
  getOriginalImage,
  getEditedImage,
  downloadEditedImage,
  OUTPUT_FORMATS,
} from "@/lib/storage"
import FileSizeComparison from "./filesize-comparison"
import RepositoryLink from "./repository-link"

interface ImageEditSettingsProps {
  settings: {
    format: string
    quality: number
  }
  onSettingsChange: (settings: ImageEditSettingsProps["settings"]) => void
  originalSize?: number
  editedSize?: number
  isProcessing?: boolean
  className?: string
}

export default function ImageEditSettings({
  settings,
  onSettingsChange,
  className,
  originalSize,
  editedSize,
  isProcessing,
}: ImageEditSettingsProps) {
  return (
    <div
      className={`relative flex h-full w-full flex-col gap-4 p-4 ${className}`}
    >
      {/* Title and Spinner */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold">Settings</h1>
        {isProcessing && <Spinner className="h-9 w-9" />}
      </div>

      {/* Format combobox */}
      <Combobox
        items={OUTPUT_FORMATS}
        value={settings.format}
        onValueChange={(value) =>
          onSettingsChange({ ...settings, format: value ?? "webp" })
        }
      >
        <ComboboxInput
          placeholder="Select output format"
          value={settings.format}
        />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No matching format found.</ComboboxEmpty>
            {OUTPUT_FORMATS.map((format) => (
              <ComboboxItem key={format} value={format}>
                {format}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {/* Quality slider */}
      <div className="grid w-full grid-cols-2 items-end">
        <label htmlFor="quality" className="text-left text-sm font-medium">
          Quality
        </label>
        <label htmlFor="quality" className="text-right text-sm font-medium">
          {settings.quality}%
        </label>
      </div>
      <Slider
        id="quality"
        min={0}
        max={100}
        value={[settings.quality]}
        onValueChange={(value) =>
          onSettingsChange({ ...settings, quality: value[0] })
        }
        disabled={settings.format === "raw"}
      />
      {/* File size comparison */}
      <FileSizeComparison
        originalSize={originalSize ?? 0}
        editedSize={editedSize ?? 0}
      />
      {/* Download button */}
      <Button onClick={downloadEditedImage}>Download</Button>
      {/* Repo link */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
        <RepositoryLink />
      </div>
    </div>
  )
}
