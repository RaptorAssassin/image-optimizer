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
import { Button } from "./ui/button"
import {
  getOriginalImage,
  getEditedImage,
  downloadEditedImage,
  OUTPUT_FORMATS,
} from "@/lib/storage"

interface ImageEditSettingsProps {
  settings: {
    format: string
    quality: number
  }
  onSettingsChange: (settings: ImageEditSettingsProps["settings"]) => void
  className?: string
}

export default function ImageEditSettings({
  settings,
  onSettingsChange,
  className,
}: ImageEditSettingsProps) {
  return (
    <div className={`flex h-full w-full flex-col gap-4 p-4 ${className}`}>
      <h1 className="text-4xl font-extrabold">Settings</h1>
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
      {/* Download button */}
      <Button onClick={downloadEditedImage}>Download</Button>
    </div>
  )
}
