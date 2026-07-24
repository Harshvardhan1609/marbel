"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress";
import { Plus, Search, Edit2, Trash2, X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

const galleryFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional().nullable(),
  image_url: z.string().min(1, "Please provide an image URL"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  order_index: z.coerce.number().default(0),
  is_published: z.boolean().default(true),
});

type GalleryFormValues = z.infer<typeof galleryFormSchema>;

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  category: string;
  order_index: number;
  is_published: boolean;
}

interface GalleryAdminClientProps {
  initialGallery: GalleryItem[];
}

export default function GalleryAdminClient({ initialGallery }: GalleryAdminClientProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema) as unknown as Resolver<GalleryFormValues>,
    defaultValues: {
      order_index: 0,
      is_published: true,
      image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    },
  });

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setUploadError(null);
    reset({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      category: item.category,
      order_index: item.order_index,
      is_published: item.is_published,
    });
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setUploadError(null);
    reset({
      title: "",
      description: "",
      image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
      category: "Italian Marbles",
      order_index: gallery.length + 1,
      is_published: true,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
      setGallery((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete gallery item: " + (err as Error).message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);
    try {
      file = await compressImage(file);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("catalogue")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("catalogue").getPublicUrl(filePath);
      setValue("image_url", data.publicUrl);
    } catch (err) {
      console.error(err);
      setUploadError((err as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values: GalleryFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        description: values.description || "",
        image_url: values.image_url,
        category: values.category,
        order_index: values.order_index,
        is_published: values.is_published,
      };

      if (values.id) {
        // Update
        const { data, error } = await supabase
          .from("gallery_items")
          .update(payload)
          .eq("id", values.id)
          .select()
          .single();

        if (error) throw error;

        setGallery((prev) =>
          prev.map((item) => (item.id === values.id ? (data as GalleryItem) : item))
        );
      } else {
        // Insert
        const { data, error } = await supabase
          .from("gallery_items")
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setGallery((prev) => [...prev, data as GalleryItem]);
      }

      setIsFormOpen(false);
      reset();
    } catch (err) {
      alert("Failed to save gallery item: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGallery = gallery.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-brand-ivory tracking-wide flex items-center gap-2">
            <ImageIcon className="h-7 w-7 text-brand-gold" />
            <span>Gallery Editor</span>
          </h1>
          <p className="text-xs text-brand-grey font-sans">
            Add high resolution slabs screenshots, stock layouts, or finished interior photos.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory hover:text-brand-charcoal transition-colors duration-300 font-sans text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 rounded-none"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Image</span>
        </button>
      </div>

      <div className="h-[1px] w-full bg-brand-gold/15" />

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A18] border border-brand-gold/10 focus:border-brand-gold pl-11 pr-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/40"
            placeholder="Search gallery..."
          />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-brand-grey font-sans">
          Total Items: <span className="text-brand-gold font-bold">{gallery.length}</span>
        </div>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="bg-[#1A1A18] border border-brand-gold/10 flex flex-col justify-between relative shadow-lg group hover:border-brand-gold/30 transition-all duration-300"
          >
            {/* Image Thumbnail */}
            <div className="aspect-[4/3] w-full bg-brand-charcoal border-b border-brand-gold/10 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-brand-charcoal/90 border border-brand-gold/20 text-[9px] uppercase font-sans tracking-wide text-brand-gold">
                {item.category}
              </div>
              {!item.is_published && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-[8px] uppercase tracking-widest text-red-400 border border-red-500/30 px-2 py-1 font-bold font-sans bg-brand-charcoal/80">
                    Draft
                  </span>
                </div>
              )}
            </div>

            {/* Info details */}
            <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-widest text-brand-grey font-semibold font-sans block">
                  Sort Rank: {item.order_index}
                </span>
                <h3 className="font-serif text-lg text-brand-ivory leading-tight font-medium tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[11px] text-brand-grey font-sans line-clamp-2 leading-relaxed pt-1">
                  {item.description || "No description provided."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-brand-gold/10 justify-end">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex items-center gap-1 text-[10px] uppercase font-sans tracking-widest text-brand-grey hover:text-brand-gold transition-colors"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 text-[10px] uppercase font-sans tracking-widest text-brand-grey hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-out Overlay Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-brand-charcoal h-full border-l border-brand-gold/10 p-8 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-brand-gold/15">
                <h3 className="font-serif text-2xl text-brand-ivory tracking-wide">
                  {editingItem ? "Edit Gallery Item" : "Create Gallery Item"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-brand-grey hover:text-brand-gold transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form inputs */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Image Caption / Title
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                    placeholder="E.g., Carrara Slab Close-up"
                  />
                  {errors.title && (
                    <span className="text-[10px] text-red-400 block">{errors.title.message}</span>
                  )}
                </div>

                {/* Category Selection Tag */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Category Group
                  </label>
                  <select
                    {...register("category")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none cursor-pointer"
                  >
                    <option value="Italian Marbles">Italian Marbles</option>
                    <option value="Indian Granites">Indian Granites</option>
                    <option value="Exotic Quartzite">Exotic Quartzite</option>
                    <option value="Luminous Onyx">Luminous Onyx</option>
                    <option value="Classic Travertine">Classic Travertine</option>
                    <option value="Installations">Installations</option>
                    <option value="Processing">Processing</option>
                  </select>
                  {errors.category && (
                    <span className="text-[10px] text-red-400 block">{errors.category.message}</span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Detailed Description
                  </label>
                  <textarea
                    rows={3}
                    {...register("description")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25 resize-none"
                    placeholder="Explain block details, veining features, or context of the photo..."
                  />
                </div>

                {/* Image URL & upload */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Showcase Image URL
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      {...register("image_url")}
                      className="flex-grow bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <label className="px-4 py-2.5 bg-brand-charcoal border border-brand-gold/20 hover:border-brand-gold hover:text-brand-gold cursor-pointer transition-colors text-brand-grey font-sans text-xs flex items-center gap-1 shrink-0">
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin text-brand-gold" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {uploadError && (
                    <span className="text-[10px] text-red-400 block mt-1 font-sans">
                      ⚠️ Upload Error: {uploadError}. (Run SQL migrations to setup storage buckets).
                    </span>
                  )}
                  {errors.image_url && (
                    <span className="text-[10px] text-red-400 block">{errors.image_url.message}</span>
                  )}
                </div>

                {/* Rank sorting index */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Sort Index / Display Rank
                  </label>
                  <input
                    type="number"
                    {...register("order_index")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  />
                </div>

                {/* Published toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    {...register("is_published")}
                    className="h-4.5 w-4.5 accent-brand-gold bg-[#1A1A18] border-brand-gold/20 focus:ring-0 cursor-pointer rounded-none"
                  />
                  <label htmlFor="is_published" className="text-xs text-brand-ivory font-sans cursor-pointer select-none">
                    Publish this image publicly (visible on public /gallery showcase grid)
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 py-4 bg-brand-gold text-brand-charcoal font-bold font-sans text-xs tracking-widest uppercase hover:bg-brand-ivory transition-colors flex items-center justify-center gap-2 rounded-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Saving Image...</span>
                    </>
                  ) : (
                    <span>Save Gallery Image</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
