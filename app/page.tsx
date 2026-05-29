import ImageUpload from "@/components/image-upload"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="mt-6 flex h-full w-full flex-col items-center gap-6 text-center">
      <h1 className="text-5xl font-extrabold capitalize">Image Optimizer</h1>
      <div className="h-full w-full"></div>
      <ImageUpload />
    </div>
  )
}
