import { get } from "http"
import { ArrowBigRight, ArrowRight } from "lucide-react"

interface FileSizeComparisonProps {
  originalSize: number
  editedSize: number
}

export default function FileSizeComparison({
  originalSize,
  editedSize,
}: FileSizeComparisonProps) {
  /**
   * Formats a file size in bytes into a string with appropriate units (B, KB, MB).
   * @param bytes - The file size in bytes.
   * @returns A formatted string representing the file size with units.
   */
  function formatFileSize(bytes: number): string {
    const KB = 1024
    const MB = KB * 1024

    if (bytes < KB) {
      return `${bytes} B`
    }

    if (bytes < MB) {
      return `${(bytes / KB).toFixed(1)} KB`
    }

    return `${(bytes / MB).toFixed(1)} MB`
  }

  /**
   * Calculate the percent change in file size from the original image to the edited image.
   * @param originalSize - The file size in bytes of the orignal image.
   * @param editedSize - The file size in bytes of the edited image.
   * @returns - A positive or negative percent count how much the file size changed from original to edited image.
   */
  function getSizeChangePercent(
    originalSize: number,
    editedSize: number
  ): number {
    return Number(
      (((editedSize - originalSize) / originalSize) * 100).toFixed(1)
    )
  }

  const cardClassName =
    "rounded-radius rounded-(--radius) border border-border p-4"

  return (
    <div className="align-center flex w-full items-center justify-center gap-4 flex-wrap">
      <div className={cardClassName}>
        <p className="font-bold">Original Size</p>
        <p>{formatFileSize(originalSize)}</p>
      </div>
      <ArrowRight size={64} strokeWidth={2} className="hidden sm:block" />
      <div className={cardClassName}>
        <p className="font-bold">Edited Size</p>
        <p
          className={
            editedSize < originalSize ? "text-green-600" : "text-destructive"
          }
        >
          {formatFileSize(editedSize)} (
          {getSizeChangePercent(originalSize, editedSize) > 0 ? "+" : ""}
          {getSizeChangePercent(originalSize, editedSize)}%)
        </p>
      </div>
    </div>
  )
}
