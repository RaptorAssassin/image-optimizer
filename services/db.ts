import Dexie, { Table } from "dexie"

export interface StoredImage {
  id: string
  originalBlob: Blob
  editedBlob: Blob
  editedAt: Date
}

export class ImageDatabase extends Dexie {
  images!: Table<StoredImage, string>

  constructor() {
    super("ImageDatabase")

    this.version(1).stores({
      images: "id, editedAt",
    })
  }
}

export const db = new ImageDatabase()
