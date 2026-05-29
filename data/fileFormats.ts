export interface ImageFormat {
  id: string
  name: string
  mimeType: string
  extension: string
  description: string
}

export const SUPPORTED_INPUT_FORMATS: ImageFormat[] = [
  {
    id: "jpeg",
    name: "JPEG / JPG",
    mimeType: "image/jpeg",
    extension: ".jpg",
    description: "",
  },
  {
    id: "png",
    name: "PNG",
    mimeType: "image/png",
    extension: ".png",
    description: "",
  },
  {
    id: "webp",
    name: "WebP",
    mimeType: "image/webp",
    extension: ".webp",
    description: "",
  },
  {
    id: "avif",
    name: "AVIF",
    mimeType: "image/avif",
    extension: ".avif",
    description: "",
  },
  {
    id: "bmp",
    name: "BMP",
    mimeType: "image/bmp",
    extension: ".bmp",
    description: "",
  },
  {
    id: "gif",
    name: "GIF (Statisch)",
    mimeType: "image/gif",
    extension: ".gif",
    description: "",
  },
]

export const SUPPORTED_OUTPUT_FORMATS: ImageFormat[] = [
  {
    id: "webp",
    name: "WebP (Empfohlen)",
    mimeType: "image/webp",
    extension: ".webp",
    description: "",
  },
  {
    id: "avif",
    name: "AVIF (High-End)",
    mimeType: "image/avif",
    extension: ".avif",
    description: "",
  },
  {
    id: "mozjpeg",
    name: "MozJPEG (Optimiert)",
    mimeType: "image/jpeg",
    extension: ".jpg",
    description: "",
  },
  {
    id: "oxipng",
    name: "OxiPNG (Verlustfrei)",
    mimeType: "image/png",
    extension: ".png",
    description: "",
  },
]
