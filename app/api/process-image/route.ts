import { svg } from "framer-motion/client"
import { NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: Request) {
  const body = await request.json()
  const { originalUrl, editedUrl, settings } = body

  if (!originalUrl) {
    return NextResponse.json({ error: "Missing originalUrl" }, { status: 400 })
  }

  // Get the image from the URL to process with sharp
  const response = await fetch(originalUrl)
  const arrayBuffer = await response.arrayBuffer()
  const imageBuffer = Buffer.from(arrayBuffer)

  // Process the image with sharp
  const processedBuffer = await sharp(imageBuffer)

  const format = settings.format.toLowerCase() || "webp"
  const quality = settings.quality || 100

  let finalBuffer: Buffer
  switch (format) {
    case "jpg":
    case "jpeg":
      finalBuffer = await processedBuffer.jpeg({ quality }).toBuffer()
      break
    case "png":
      finalBuffer = await processedBuffer
        .png({
          quality,
          compressionLevel: 9,
          adaptiveFiltering: true,
        })
        .toBuffer()
      break
    case "tiff":
      finalBuffer = await processedBuffer.tiff({ quality }).toBuffer()
      break
    case "avif":
      finalBuffer = await processedBuffer.avif({ quality }).toBuffer()
      break
    case "heif":
      finalBuffer = await processedBuffer.heif({ quality }).toBuffer()
      break
    case "raw":
      finalBuffer = await processedBuffer.raw().toBuffer()
      break
    default:
      finalBuffer = await processedBuffer.webp({ quality }).toBuffer()
  }

  // Uload the image to hacklub CDN and get the new URL, then save URL to localStorage
  const formData = new FormData()
  const mimeType = `image/${format === "jpg" ? "jpeg" : format}`
  const blob = new Blob([finalBuffer as unknown as ArrayBuffer], {
    type: mimeType,
  })
  formData.append("file", blob, `processed-image.${format}`)

  const uploadResponse = await fetch(`${process.env.CDN_API_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CDN_API_KEY}` },
    body: formData,
  })
  const { url } = await uploadResponse.json()

  return NextResponse.json({ url })
}
