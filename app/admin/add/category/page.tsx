"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/add/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Category "${data.name}" added successfully!`);
        setName("");
        router.refresh();
      } else {
        setError(data.msg || "An unknown error occurred.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Create New Category</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              placeholder="e.g. Electronics"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
                setSuccess(null);
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
          {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}

          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}