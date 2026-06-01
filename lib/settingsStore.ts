import create from "zustand"

export const INPUT_FORMATS = [
  "jpg",
  "png",
  "webp",
  "avif",
  "tiff",
  "gif",
  "svg",
  "heif",
  "raw",
] as const

export const OUTPUT_FORMATS = [
  "jpg",
  "png",
  "webp",
  "avif",
  "tiff",
  "heif",
  "gif",
  "raw",
] as const

export type InputFormat = (typeof INPUT_FORMATS)[number]
export type OutputFormat = (typeof OUTPUT_FORMATS)[number]

export interface ImageSettings {
  format: InputFormat
  quality: number
}

export interface PNGSettings extends ImageSettings {
  colors: number | 256
}

export interface WebPSettings extends ImageSettings {
  lossless: boolean | true
}

type SettingsState = {
  format: InputFormat
  quality: number
  setFormat: (f: InputFormat) => void
  setQuality: (q: number) => void
  setSettings: (s: Partial<ImageSettings>) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  format: "webp",
  quality: 80,
  setFormat: (format: InputFormat) => set({ format }),
  setQuality: (quality: number) => set({ quality }),
  setSettings: (s: Partial<ImageSettings>) =>
    set((state) => ({ ...state, ...s })) as void,
}))

export default useSettingsStore
