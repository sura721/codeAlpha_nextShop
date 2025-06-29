
"use client"

import { Loader } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
    </div>
  )
}
