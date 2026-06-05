export const runtime = "nodejs"

import { NextResponse } from "next/server"
import FormData from "form-data"

export async function POST(request: Request) {
  const requestformData = await request.formData()
  const image = requestformData.get("file") as File

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await image.arrayBuffer())
    const form = new FormData()
    form.append("file", buffer, {
      filename: image.name,
      contentType: image.type,
    })

    const response = await fetch(`${process.env.CDN_API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CDN_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form as any,
    })

    if (!response.ok) {
      const body = await response.text()
      console.error({
        status: response.status,
        statusText: response.statusText,
        body,
      })

      return NextResponse.json(
        {
          status: response.status,
          statusText: response.statusText,
          body,
        },
        { status: response.status }
      )
    }
    const { url } = await response.json()
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
