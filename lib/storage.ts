const isOnClient = () => typeof window !== 'undefined'

export const storeImage = (originalId: string, editedId: string) => {
 if (!isOnClient) return
  const stored = localStorage.getItem("current")
  const currentObj = stored ? JSON.parse(stored) : {}
  const editedObj = {
    ...currentObj,
    originalId,
    editedId,
    editedAt: new Date().toISOString()
  }
  localStorage.setItem("current", JSON.stringify(editedObj))
}

export const getStoredImage = () => {}

export const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData
    })

    if (!response.ok) {
        throw new Error("Failed to upload image")
    }

    // const data = await response.json()
    // return data
}