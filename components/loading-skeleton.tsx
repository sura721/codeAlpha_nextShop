"use client"

import { motion } from "framer-motion"

interface LoadingSkeletonProps {
  count?: number
  type?: "card" | "list" | "detail"
}

export default function LoadingSkeleton({ count = 6, type = "card" }: LoadingSkeletonProps) {
  if (type === "detail") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="bg-gray-200 rounded-2xl h-96"
          />

          {/* Content skeleton */}
          <div className="space-y-4">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
              className="bg-gray-200 rounded h-8 w-3/4"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              className="bg-gray-200 rounded h-6 w-1/2"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
              className="bg-gray-200 rounded h-4 w-full"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
              className="bg-gray-200 rounded h-4 w-5/6"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              className="bg-gray-200 rounded h-12 w-32"
            />
          </div>
        </div>
      </div>
    )
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg"
          >
            <div className="bg-gray-200 rounded w-16 h-16" />
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 rounded h-4 w-3/4" />
              <div className="bg-gray-200 rounded h-3 w-1/2" />
            </div>
            <div className="bg-gray-200 rounded h-6 w-20" />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gray-200 h-64" />
          <div className="p-6 space-y-3">
            <div className="bg-gray-200 rounded h-6 w-3/4" />
            <div className="bg-gray-200 rounded h-4 w-full" />
            <div className="bg-gray-200 rounded h-4 w-5/6" />
            <div className="flex justify-between items-center">
              <div className="bg-gray-200 rounded h-6 w-20" />
              <div className="bg-gray-200 rounded h-4 w-16" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
