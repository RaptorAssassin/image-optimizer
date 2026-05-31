import create from "zustand"

type ImageState = {
  // Working copy (modifiable by editors/libraries)
  file: File | null
  url: string | null

  // Original uploaded file (kept immutable)
  originalFile: File | null
  originalUrl: string | null

  // Set the original file (called at upload time). This will also
  // create a working copy so editors can modify `file` without
  // mutating the original.
  setOriginalFile: (file: File) => void

  // Replace the working copy (e.g. when a library returns a modified Blob)
  setWorkingFile: (fileOrBlob: File | Blob) => void

  // Reset the working copy back to the original
  resetWorking: () => void

  clear: () => void

  // Helpers to get ArrayBuffers from working/original
  getArrayBuffer: () => Promise<ArrayBuffer | null>
  getOriginalArrayBuffer: () => Promise<ArrayBuffer | null>
}

export const useImageStore = create<ImageState>((set, get) => ({
  file: null,
  url: null,
  originalFile: null,
  originalUrl: null,

  setOriginalFile: (file: File) => {
    // revoke previous original URL if present
    const prevOriginal = get().originalUrl
    if (prevOriginal) URL.revokeObjectURL(prevOriginal)
    const originalUrl = URL.createObjectURL(file)

    // revoke previous working URL if present
    const prevWorking = get().url
    if (prevWorking) URL.revokeObjectURL(prevWorking)

    // create a new working copy (so modifications don't touch the original)
    const workingCopy = new File([file], file.name, { type: file.type })
    const workingUrl = URL.createObjectURL(workingCopy)

    set({ originalFile: file, originalUrl, file: workingCopy, url: workingUrl })
  },

  setWorkingFile: (fileOrBlob: File | Blob) => {
    const prev = get().url
    if (prev) URL.revokeObjectURL(prev)

    let newFile: File
    if (fileOrBlob instanceof File) {
      newFile = fileOrBlob
    } else {
      const name = get().originalFile?.name ?? "edited"
      const type =
        (fileOrBlob as Blob).type ||
        get().originalFile?.type ||
        "application/octet-stream"
      newFile = new File([fileOrBlob], name, { type })
    }

    const url = URL.createObjectURL(newFile)
    set({ file: newFile, url })
  },

  resetWorking: () => {
    const original = get().originalFile
    const prev = get().url
    if (prev) URL.revokeObjectURL(prev)
    if (!original) {
      set({ file: null, url: null })
      return
    }
    const workingCopy = new File([original], original.name, {
      type: original.type,
    })
    const workingUrl = URL.createObjectURL(workingCopy)
    set({ file: workingCopy, url: workingUrl })
  },

  clear: () => {
    const prevOriginal = get().originalUrl
    if (prevOriginal) URL.revokeObjectURL(prevOriginal)
    const prev = get().url
    if (prev) URL.revokeObjectURL(prev)
    set({ file: null, url: null, originalFile: null, originalUrl: null })
  },

  getArrayBuffer: async () => {
    const f = get().file
    if (!f) return null
    return f.arrayBuffer()
  },

  getOriginalArrayBuffer: async () => {
    const f = get().originalFile
    if (!f) return null
    return f.arrayBuffer()
  },
}))
