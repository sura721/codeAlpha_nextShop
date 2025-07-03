"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, PlusCircle, XCircle, UploadCloud } from "lucide-react";
import { toast } from 'react-hot-toast';
import { createProductWithVariants } from "@/lib/actions/product.actions";
import { useUploadThing } from "@/lib/uploadthing";

type Category = { id: string; name: string; };

interface VariantState {
  name: string;
  price: string;
  offerPrice: string;
  inStock: string;
  imageFile: File | null;
  imagePreview: string;
}

const initialVariantState: VariantState = {
  name: "",
  price: "",
  offerPrice: "",
  inStock: "",
  imageFile: null,
  imagePreview: "",
};

export default function AddProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<VariantState[]>([initialVariantState]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/add/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleVariantChange = (index: number, field: keyof Omit<VariantState, 'imageFile' | 'imagePreview'>, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleImageSelect = (index: number, file: File) => {
    const newVariants = [...variants];
    newVariants[index].imageFile = file;
    if (newVariants[index].imagePreview) {
      URL.revokeObjectURL(newVariants[index].imagePreview);
    }
    newVariants[index].imagePreview = URL.createObjectURL(file);
    setVariants(newVariants);
  }

  const addVariant = () => {
    setVariants([...variants, { ...initialVariantState }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const filesToUpload = variants
        .map(v => v.imageFile)
        .filter((file): file is File => file !== null);

      if (filesToUpload.length !== variants.length) {
        toast.error("Each variant must have an image.");
        return;
      }

      if (!startUpload) {
        toast.error("Uploader is not ready. Please try again in a moment.");
        return;
      }
      
      const uploadedImages = await startUpload(filesToUpload);

      if (!uploadedImages || uploadedImages.length !== variants.length) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      const productData = {
        title,
        description,
        categoryId,
        variants: variants.map((variant, index) => ({
          name: variant.name,
          price: parseFloat(variant.price) || 0,
          offerPrice: variant.offerPrice ? parseFloat(variant.offerPrice) : null,
          inStock: parseInt(variant.inStock, 10) || 0,
          image: uploadedImages[index].url,
        })),
      };

      const result = await createProductWithVariants(productData);

      if (result.success) {
        toast.success("Product and variants added successfully!");
        router.push("/admin/products");
      } else {
        let errorMsg = "An unexpected error occurred.";
        if (result.error) {
          if ('form' in result.error && typeof result.error.form === 'string') {
            errorMsg = result.error.form;
          } else {
            errorMsg = "Please check all fields for errors.";
          }
        }
        toast.error(errorMsg);
      }
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-6 p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Main Details</h2>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">Product Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white">
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Product Variants</h2>
          {variants.map((variant, index) => (
            <div key={index} className="p-6 border rounded-lg bg-white shadow-sm relative space-y-4">
              {variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                  <XCircle size={20} />
                </button>
              )}
              <h3 className="font-medium text-gray-600">Variant {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Variant Name (e.g., Blue)" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="number" placeholder="Stock Quantity" value={variant.inStock} onChange={(e) => handleVariantChange(index, 'inStock', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="number" placeholder="Price ($)" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="number" placeholder="Offer Price (Optional)" value={variant.offerPrice} onChange={(e) => handleVariantChange(index, 'offerPrice', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="w-full">
                  <div
                    onClick={() => fileInputRefs.current[index]?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-indigo-500 transition-colors relative"
                  >
                    {variant.imagePreview ? (
                      <Image src={variant.imagePreview} alt="Variant preview" fill className="object-cover" />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center gap-1 text-center p-2">
                        <UploadCloud className="w-8 h-8" />
                        <span className="text-xs select-none">Select Image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                     ref={(el) => {
                      fileInputRefs.current[index] = el;
                    }}
                    onChange={(e) => e.target.files && handleImageSelect(index, e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
            <PlusCircle size={16} /> Add Another Variant
          </button>
        </div>
        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isPending} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isPending ? "Saving Product..." : "Save Product"}
          </button>
        </div>
      </form>
    </main>
  );
}