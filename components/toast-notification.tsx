"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"
import { useEffect } from "react"

interface ToastNotificationProps {
  show: boolean
  message: string
  onClose: () => void
  type?: "success" | "error" | "info"
}

export default function ToastNotification({ show, message, onClose, type = "success" }: ToastNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.3 }}
          className="fixed top-20 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${type === "success" ? "bg-green-100" : "bg-red-100"}`}>
              <CheckCircle className={`h-5 w-5 ${type === "success" ? "text-green-600" : "text-red-600"}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
