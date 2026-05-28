"use client"
import { useRef, useState } from "react"
import { CloudIcon, UploadIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Spinner } from "./ui/spinner"

export default function ImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const simulateUpload = () => {
    setIsUploading(true)
    // simulate an async upload/process then return to idle
    setTimeout(() => setIsUploading(false), 1800)
  }

  const selectFile = () => {
    inputRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    simulateUpload()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload()
      e.dataTransfer.clearData()
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div
      className="mx-auto flex max-h-[50vh] min-h-60 max-w-[80vw] min-w-2xs items-center justify-center rounded-lg border-2 border-dashed border-accent p-4 hover:cursor-pointer"
      onClick={selectFile}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            // clicking inside while uploading cancels visual state (for demo)
            onClick={() => setIsUploading(false)}
            key="uploading"
            className="flex flex-col items-center gap-2 text-center text-xl font-bold"
            initial={{ scale: 1 }}
            animate={{ scale: 0.9 }}
            exit={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* <CloudIcon /> */}
            <Spinner className="h-12 w-12 text-muted-foreground" />
            Uploading...
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            className="flex flex-col items-center gap-2 text-center text-xl font-bold"
            initial={{ scale: 1 }}
            animate={{ scale: 0.95 }}
            exit={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <UploadIcon className="h-12 w-12 text-muted-foreground" />
            Click here or drag and drop your image here to optimize it!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
