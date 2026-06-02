const isOnClient = () => typeof window !== 'undefined'

export const storeImage = (originalId: string, editedId: string) => {
 if (!isOnClient) return
  stored = localStorage.getItem("current")
  currentObj = stored ? JSON.parse(storedData) : {}
  editedObj = {
    ...currentObj,
    originalId,
    editedId,
    editedAt: new Date().toISOString()
  }
  localStorage.setItem("current", JSON.stringify(editedObj))
}
