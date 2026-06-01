import { NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get("file") as Blob | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const format = String(
      (form.get("format") as string) ?? "webp"
    ).toLowerCase()
    const qualityRaw = form.get("quality") ?? "80"
    const quality = Math.min(Math.max(Number(String(qualityRaw)) || 80, 0), 100)

    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    let image = sharp(inputBuffer)

    let outBuffer: Buffer
    let contentType = `image/${format === "jpg" ? "jpeg" : format}`

    switch (format) {
      case "jpg":
      case "jpeg":
        outBuffer = await image.jpeg({ quality, mozjpeg: true }).toBuffer()
        contentType = "image/jpeg"
        break
      case "png":
        // PNG: use max compression level and adaptive filtering (lossless)
        outBuffer = await image
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toBuffer()
        contentType = "image/png"
        break
      case "webp":
        // WebP: use lossless mode
        outBuffer = await image.webp({ quality, lossless: true }).toBuffer()
        contentType = "image/webp"
        break
      case "avif":
        // AVIF: prefer lossless when available
        outBuffer = await image.avif({ quality, lossless: true }).toBuffer()
        contentType = "image/avif"
        break
      case "tiff":
        // TIFF: use LZW (lossless) compression
        outBuffer = await image.tiff({ quality, compression: "lzw" }).toBuffer()
        contentType = "image/tiff"
        break
      case "heif":
        // HEIF/HEIC: use lossless when available
        outBuffer = await image.heif({ quality, lossless: true }).toBuffer()
        contentType = "image/heif"
        break
      case "gif":
        // GIF output is not universally supported by sharp; fall back to lossless WebP
        outBuffer = await image.webp({ quality, lossless: true }).toBuffer()
        contentType = "image/webp"
        break
      case "raw": {
        // raw: return raw pixel data
        const { data } = await image.raw().toBuffer({ resolveWithObject: true })
        outBuffer = data
        contentType = "application/octet-stream"
        break
      }
      default:
        outBuffer = await image.webp({ quality, lossless: true }).toBuffer()
        contentType = "image/webp"
        break
    }

    const filename = `processed-image.${format === "jpg" ? "jpg" : format}`

    const body = new Uint8Array(outBuffer)
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(outBuffer.length),
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 }
    )
  }
}
