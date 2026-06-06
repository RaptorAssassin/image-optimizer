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
import { getStoredImage } from "@/lib/storage-old"
import { OUTPUT_FORMATS } from "@/lib/storage"

interface ImageEditSettingsProps {
  settings: {
    format: string
    quality: number
  }
  onSettingsChange: (settings: ImageEditSettingsProps["settings"]) => void
}

export default function ImageEditSettings({
  settings,
  onSettingsChange,
}: ImageEditSettingsProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Format combobox */}
      <Combobox>
        <ComboboxInput
          placeholder="Select output format"
          value={settings.format}
        />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No matching format found.</ComboboxEmpty>
            {OUTPUT_FORMATS.map((format) => (
              <ComboboxItem
                key={format}
                value={format}
                onSelect={() => onSettingsChange({ ...settings, format })}
              >
                {format}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {/* Quality slider */}
      <label htmlFor="quality" className="text-sm font-medium">
        Quality
      </label>
      <Slider
        id="quality"
        min={0}
        max={100}
        value={[settings.quality]}
        onValueChange={(value) =>
          onSettingsChange({ ...settings, quality: value[0] })
        }
      />
      {/* Download button */}
      <Button onClick={downloadImage}>Download</Button>
    </div>
  )
}
