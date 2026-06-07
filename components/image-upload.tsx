"use client"
import { useRef, useState, useEffect } from "react"
import { storeImage } from "@/lib/storage"
import { UploadIcon, Check, X } from "lucide-react"
import { motion, AnimatePresence, type Transition } from "framer-motion"
import { Spinner } from "./ui/spinner"
import { SUPPORTED_INPUT_FORMATS } from "../data/fileFormats"
import { useRouter } from "next/navigation"

export default function ImageUpload() {
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle")
  const [isDragActive, setIsDragActive] = useState(false)
  const isUploading = status === "uploading"
  const inputRef = useRef<HTMLInputElement | null>(null)
  const timersRef = useRef<number[]>([])
  const isMounted = useRef(true) // <-- Tracks if the component is still active
  const router = useRouter()

  const errorWaitTime = 2000
  const successWaitTime = 500

  const pushTimeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }

  // Handle component unmount safely
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false // <-- Blocks any further state updates
      timersRef.current.forEach((id) => window.clearTimeout(id))
      timersRef.current = []
    }
  }, [])

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }
    setVh()
    window.addEventListener("resize", setVh)
    window.addEventListener("orientationchange", setVh)
    return () => {
      window.removeEventListener("resize", setVh)
      window.removeEventListener("orientationchange", setVh)
    }
  }, [])

  const acceptString = SUPPORTED_INPUT_FORMATS.map((f) => f.mimeType).join(",")

  const handleSelectedFile = async (file?: File | null) => {
    if (!file) return

    try {
      setStatus("uploading")
      await storeImage(file)

      // Safety check: Don't update state if user closed tab or navigated away mid-upload
      if (!isMounted.current) return
      setStatus("success")

      pushTimeout(() => {
        // Only route if we are still mounted
        if (isMounted.current) {
          router.push("/edit")
        }
      }, successWaitTime)
    } catch (err) {
      console.error(err)
      if (!isMounted.current) return
      setStatus("error")

      pushTimeout(() => {
        if (isMounted.current) setStatus("idle")
      }, errorWaitTime)
    }
  }

  const selectFile = async () => {
    if (isUploading) return

    try {
      const show = (window as any).showOpenFilePicker
      if (typeof show === "function") {
        const types = [
          {
            description: "Images",
            accept: SUPPORTED_INPUT_FORMATS.reduce(
              (acc, cur) => {
                if (!acc[cur.mimeType]) acc[cur.mimeType] = []
                acc[cur.mimeType].push(cur.extension)
                return acc
              },
              {} as Record<string, string[]>
            ),
          },
        ]

        const [handle] = await (window as any).showOpenFilePicker({
          multiple: false,
          types,
          excludeAcceptAllOption: true,
        })

        const file = await handle.getFile()
        handleSelectedFile(file)
        return
      }
    } catch (err: any) {
      const name = err?.name || ""
      if (["AbortError", "NotAllowedError", "SecurityError"].includes(name)) {
        return
      }
    }

    // Simplified native click fallback without the problematic window focus listener
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    handleSelectedFile(file)

    // Reset input value so selecting the same file again still fires onChange
    if (e.target) e.target.value = ""
  }

  // --- Keep all your Drag & Drop / Animation code exactly the same below this line ---
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const hasFiles = Array.from(e.dataTransfer.items || []).some(
      (i) => i.kind === "file"
    )
    if (hasFiles) setIsDragActive(true)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const hasFiles = Array.from(e.dataTransfer.items || []).some(
      (i) => i.kind === "file"
    )
    setIsDragActive(hasFiles)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
    const file = e.dataTransfer.files?.[0] ?? null
    handleSelectedFile(file)
    e.dataTransfer.clearData()
  }

  const spring: Transition = {
    type: "spring",
    stiffness: 700,
    damping: 20,
    bounce: 0.35,
  }
  const textSpring: Transition = { type: "spring", stiffness: 700, damping: 24 }
  const stateKey = isDragActive ? "drag" : status
  const baseTextClass =
    "text-center text-lg font-semibold select-none md:text-2xl"

  const StatePanel = ({
    panelKey,
    icon,
    text,
    textClassName,
  }: {
    panelKey: string
    icon: React.ReactNode
    text: React.ReactNode
    textClassName?: string
  }) => (
    <motion.div
      key={panelKey}
      className="absolute inset-0 flex flex-col items-center justify-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
    >
      <motion.div
        className="pointer-events-none flex items-center justify-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={spring}
      >
        {icon}
      </motion.div>
      <motion.span
        className={textClassName ?? baseTextClass}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={textSpring}
      >
        {text}
      </motion.span>
    </motion.div>
  )

  return (
    <div
      className={`mx-auto mt-6 mb-6 box-border flex max-h-[calc(var(--vh,1vh)*100-3rem)] min-h-[60vh] w-[92vw] max-w-300 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-accent p-4 transition-all duration-300 ease-in-out sm:p-6 md:mt-12 md:h-auto md:max-h-[calc(var(--vh,1vh)*100-4.5rem)] md:min-h-[50vh] md:w-[80vw] md:rounded-xl md:p-8 lg:w-[65vw] xl:w-[55vw] ${isDragActive ? "bg-accent/50" : "hover:bg-accent/50"}`}
      onClick={selectFile}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        className="hidden"
        onChange={onFileChange}
      />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-2">
        <AnimatePresence initial={false} mode="wait">
          {stateKey === "uploading" ? (
            <StatePanel
              panelKey={stateKey}
              icon={<Spinner className="h-10 w-10 text-muted-foreground" />}
              text="Uploading..."
            />
          ) : stateKey === "success" ? (
            <StatePanel
              panelKey={stateKey}
              icon={<Check className="h-10 w-10 text-muted-foreground" />}
              text="Upload complete"
            />
          ) : stateKey === "error" ? (
            <StatePanel
              panelKey={stateKey}
              icon={<X className="h-10 w-10 text-destructive/50" />}
              text="Upload failed. Make sure you upload a valid image."
              textClassName={`${baseTextClass} text-destructive/50`}
            />
          ) : stateKey === "drag" ? (
            <StatePanel
              panelKey={stateKey}
              icon={<UploadIcon className="h-10 w-10 text-muted-foreground" />}
              text="Drop to upload"
            />
          ) : (
            <StatePanel
              panelKey={stateKey}
              icon={<UploadIcon className="h-10 w-10 text-muted-foreground" />}
              text="Click here or drag and drop your image to optimize it"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
