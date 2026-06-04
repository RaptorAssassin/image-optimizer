import { describe, it, expect, vi } from "vitest"
import { POST } from "./route"

describe("POST /api/upload", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 200 and URL on successful upload", async () => {
    // Create mock data
    const mockFormData = new FormData()
    mockFormData.append(
      "originalUrl",
      "https://cdn.hackclub.com/019e8cb2-48ce-7b29-8900-7fb5ea204b44/test.png"
    )
    mockFormData.append(
      "settings",
      JSON.stringify({ format: "jpg", quality: 80 })
    )

    // Simulate request
    const request = new Request("http://localhost:3000/api/process-image", {
      method: "POST",
      body: mockFormData
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toHaveProperty("url")
  })

  it("returns 400 when missing originalUrl", async () => {
    const mockFormData = new FormData()
    const request = new Request("http://localhost:3000/api/process-image", {
      method: "POST",
      body: mockFormData,
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
