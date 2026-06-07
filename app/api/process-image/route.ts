import { NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: Request) {
  const requestFormData = await request.formData()
  const image = requestFormData.get("image") as Blob | null
  const settings = requestFormData.get("settings") as string

  if (!image) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 })
  }

  // Parse settings with fallback to defaults
  const parsedSettings =
    typeof settings === "string" ? JSON.parse(settings) : settings
  const format = parsedSettings?.format?.toLowerCase() || "webp"
  const quality = parsedSettings.quality || 100

  // Process the image with sharp
  const imageBuffer = await image.arrayBuffer()
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
    default:
      finalBuffer = await sharp(imageBuffer).webp({ quality }).toBuffer()
  }

  const mimeType = `image/${format === "jpg" ? "jpeg" : format}`

  return new NextResponse(new Uint8Array(finalBuffer), {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="optimized.${format}"`,
    },
  })
}
