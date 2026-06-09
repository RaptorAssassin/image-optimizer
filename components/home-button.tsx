"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"

export default function HomeButton() {
  const router = useRouter()

  return (
    <Button
      className="absolute top-4 left-4 z-50"
      onClick={() => router.push("/")}
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
  )
}
