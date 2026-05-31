import { useState } from "react"
import { Slider } from "./ui/slider"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
} from "./ui/combobox"

interface ImageEditSettingsProps {
  className?: string
}

export default function ImageEditSettings({
  className,
}: ImageEditSettingsProps) {
  const [quality, setQuality] = useState(50)
  const qualityDefaultValue: number = 80
  return (
    <div className={"p-8 " + className}>
      <h1 className="my-4 text-4xl font-bold">Edit Settings</h1>
      <div className="flex flex-col gap-6">
        {/* File format selection combobox */}
        <div>
          <Combobox>
            <ComboboxInput placeholder="Select file format"></ComboboxInput>
            <ComboboxContent>
              <ComboboxEmpty>Nothing found.</ComboboxEmpty>
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
            defaultValue={[qualityDefaultValue]}
            onValueChange={(value) => setQuality(value[0])}
          />
        </div>
      </div>
    </div>
  )
}
