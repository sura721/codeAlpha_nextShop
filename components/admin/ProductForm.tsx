'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  offerPrice?: number | null;
  inStock: number;
  categoryId: string;
  images: string[];
};

type ProductFormProps = {
  product?: Product;
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [inStock, setInStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(['', '', '', '']);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);

  useEffect(() => {
    if (isEditing && product) {
      setTitle(product.title);
      setDescription(product.description);
      setPrice(String(product.price));
      setOfferPrice(product.offerPrice ? String(product.offerPrice) : '');
      setInStock(String(product.inStock));
      setCategoryId(product.categoryId);
      const previews = [...imagePreviews];
      for (let i = 0; i < product.images.length; i++) {
        if (i < 4) previews[i] = product.images[i];
      }
      setImagePreviews(previews);
    }
  }, [product, isEditing]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/add/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  function handleBoxClick(index: number) {
    if (isSubmitting) return;
    inputRefs[index].current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
    const reader = new FileReader();
    reader.onload = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = reader.result as string;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEditing && imageFiles.every((file) => file === null)) {
      toast.error("Please upload at least one image.");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (offerPrice) formData.append('offerPrice', offerPrice);
    formData.append('inStock', inStock);
    formData.append('categoryId', categoryId);
    imageFiles.forEach((file) => {
      if (file) formData.append('images', file);
    });

    try {
      const endpoint = isEditing ? `/api/products/${product.id}` : '/api/add/product';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(endpoint, { method, body: formData });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Product ${isEditing ? 'updated' : 'added'} successfully!`);
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(`Error: ${data.msg || `Failed to ${isEditing ? 'update' : 'add'} product`}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Product Images</label>
        <p className="text-xs text-slate-500">Add up to 4 images. The first image will be the main one.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {imagePreviews.map((preview, idx) => (
            <div key={idx} onClick={() => handleBoxClick(idx)} className="relative aspect-square border-2 border-dashed border-slate-300 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-purple-500 transition-colors">
              {preview ? (<Image src={preview} alt={`Preview ${idx + 1}`} fill className="object-cover"/>) : (<div className="text-slate-400 flex flex-col items-center gap-1"><UploadCloud className="w-6 h-6" /><span className="text-xs text-center select-none">Add Image</span></div>)}
              <input type="file" accept="image/*" className="hidden" ref={inputRefs[idx]} onChange={(e) => handleFileChange(e, idx)} disabled={isSubmitting} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">Product Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-slate-700">Category</label>
          <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required disabled={isFetchingCategories} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white">
            <option value="" disabled>{isFetchingCategories ? "Loading categories..." : "Select a category"}</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="inStock" className="text-sm font-medium text-slate-700">Items in Stock</label>
          <input id="inStock" type="number" value={inStock} onChange={(e) => setInStock(e.target.value)} required min="0" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-slate-700">Price</label>
          <div className="relative"><span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span><input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" /></div>
        </div>
        <div className="space-y-2">
          <label htmlFor="offerPrice" className="text-sm font-medium text-slate-700">Offer Price <span className="text-slate-400">(Optional)</span></label>
          <div className="relative"><span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span><input id="offerPrice" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} min="0" step="0.01" className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" /></div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isSubmitting || isFetchingCategories} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed">
          {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isSubmitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Product')}
        </button>
      </div>
    </form>
  );
}