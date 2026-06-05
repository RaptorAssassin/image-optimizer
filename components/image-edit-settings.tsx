"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { OUTPUT_FORMATS } from "../lib/settingsStore"
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

export default function ImageEditSettings() {
  const [settings, setSettings] = useState({
    format: "webp",
    quality: 80,
  })

  const processImage = async () => {
    const originalUrl = getStoredImage()
    if (!originalUrl) return

    const formData = new FormData()
    formData.append("originalUrl", originalUrl)
    formData.append("settings", JSON.stringify(settings))
    try {
      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        console.error("Failed to process image")
        return
      }
    } catch (error) {
      console.error("Error processing image")
      return
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* format combobox */}
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
                onSelect={() => setSettings((prev) => ({ ...prev, format }))}
              >
                {format}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {/* quality slider */}
      <label htmlFor="quality" className="text-sm font-medium"></label>
      <Slider
        id="quality"
        min={0}
        max={100}
        value={[settings.quality]}
        onValueChange={(value) =>
          setSettings((prev) => ({ ...prev, quality: value[0] }))
        }
      />
    </div>
  )
}
