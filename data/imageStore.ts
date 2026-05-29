import create from "zustand"

type ImageState = {
  file: File | null
  url: string | null
  setFile: (file: File) => void
  clear: () => void
  getArrayBuffer: () => Promise<ArrayBuffer | null>
}

export const useImageStore = create<ImageState>((set, get) => ({
  file: null,
  url: null,

  setFile: (file: File) => {
    // Revoke any previous object URL to avoid memory leaks
    const prev = get().url
    if (prev) URL.revokeObjectURL(prev)
    const url = URL.createObjectURL(file)
    set({ file, url })
  },

  clear: () => {
    const prev = get().url
    if (prev) URL.revokeObjectURL(prev)
    set({ file: null, url: null })
  },

  getArrayBuffer: async () => {
    const f = get().file
    if (!f) return null
    return f.arrayBuffer()
  },
}))
