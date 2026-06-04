import { NextResponse } from "next/server"
import sharp from "sharp"
import FormData from "form-data"
import { Readable } from "stream"

export async function POST(request: Request) {
  const requestFormData = await request.formData()
  
  const originalUrl = requestFormData.get("originalUrl") as string
  const editedUrl = requestFormData.get("editedUrl") as string | null
  const settings = requestFormData.get("settings") as string

  if (!originalUrl) {
    return NextResponse.json({ error: "Missing originalUrl" }, { status: 400 })
  }

  // Delete existing edited image
  if (editedUrl) {
    try {
      const pathname = new URL(editedUrl).pathname
      const editedId = pathname.split("/").pop()
      await fetch(`${process.env.CDN_API_URL}/upload/${editedId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.CDN_API_KEY}` },
      })
    } catch (error) {
      console.error("Error deleting edited image:", error)
    }
  }

  // Get the image from the URL to process with sharp
  const response = await fetch(originalUrl)
  const arrayBuffer = await response.arrayBuffer()
  const imageBuffer = Buffer.from(arrayBuffer)

  // Process the image with sharp
  const processedBuffer = await sharp(imageBuffer)

  const parsedSettings = typeof settings === "string" ? JSON.parse(settings) : settings
  const format = parsedSettings.format.toLowerCase() || "webp"
  const quality = parsedSettings.quality || 100

  let finalBuffer: Buffer
  switch (format) {
    case "jpg":
    case "jpeg":
      finalBuffer = await sharp(imageBuffer).jpeg({ quality }).toBuffer()
      break
    case "png":
      finalBuffer = await sharp(imageBuffer)
        .png({
          quality,
          compressionLevel: 9,
          adaptiveFiltering: true,
        })
        .toBuffer()
      break
    case "tiff":
      finalBuffer = await sharp(imageBuffer).tiff({ quality }).toBuffer()
      break
    case "avif":
      finalBuffer = await sharp(imageBuffer).avif({ quality }).toBuffer()
      break
    case "heif":
      finalBuffer = await sharp(imageBuffer).heif({ quality }).toBuffer()
      break
    case "raw":
      finalBuffer = await sharp(imageBuffer).raw().toBuffer()
      break
    default:
      finalBuffer = await sharp(imageBuffer).webp({ quality }).toBuffer()
  }

  // Uload the image to hacklub CDN and get the new URL, then save URL to localStorage
  const formData = new FormData()
  const mimeType = `image/${format === "jpg" ? "jpeg" : format}`

  formData.append("file", finalBuffer, {
    filename: `optimized.${format}`,
    contentType: mimeType,
  })


  let uploadUrl: string | undefined
  try {
    const uploadResponse = await fetch(`${process.env.CDN_API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CDN_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: Readable.toWeb(formData) as ReadableStream,
    })
    const { url } = await uploadResponse.json()
    uploadUrl = url
  } catch (error) {
    console.error("Error uploading processed image:", error)
    return NextResponse.json(
      { error: "Failed to upload processed image" },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: uploadUrl })
}
