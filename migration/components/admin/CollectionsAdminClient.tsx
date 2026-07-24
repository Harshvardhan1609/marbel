"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress";
import { Plus, Search, Edit2, Trash2, X, Upload, Loader2, Layers } from "lucide-react";

const collectionFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional().nullable(),
  image_url: z.string().min(1, "Please provide an image URL"),
  colours: z.array(z.string()).min(1, "Select at least one colour"),
  is_published: z.boolean().default(true),
});

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  colours: string[];
  is_published: boolean;
}

interface CollectionsAdminClientProps {
  initialCollections: Collection[];
}

const PRESET_COLOURS = ["White", "Black", "Grey", "Gold", "Green", "Pink", "Beige", "Brown", "Mixed"];

export default function CollectionsAdminClient({ initialCollections }: CollectionsAdminClientProps) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customColour, setCustomColour] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema) as unknown as Resolver<CollectionFormValues>,
    defaultValues: {
      colours: [],
      is_published: true,
      image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    },
  });

  const watchedColours = watch("colours") || [];

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setUploadError(null);
    reset({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image_url: collection.image_url || "",
      colours: collection.colours || [],
      is_published: collection.is_published,
    });
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingCollection(null);
    setUploadError(null);
    reset({
      name: "",
      slug: "",
      description: "",
      image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
      colours: [],
      is_published: true,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection? Products belonging to it will lose their category association.")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete collection: " + (err as Error).message);
    }
  };

  const handleAddCustomColour = () => {
    const trimmed = customColour.trim();
    if (!trimmed) return;
    if (!watchedColours.includes(trimmed)) {
      setValue("colours", [...watchedColours, trimmed]);
    }
    setCustomColour("");
  };

  const handleRemoveColour = (col: string) => {
    setValue("colours", watchedColours.filter((c) => c !== col));
  };

  const handleTogglePresetColour = (col: string) => {
    if (watchedColours.includes(col)) {
      setValue("colours", watchedColours.filter((c) => c !== col));
    } else {
      setValue("colours", [...watchedColours, col]);
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
      const filePath = `categories/${fileName}`;

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

  const onSubmit = async (values: CollectionFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        description: values.description || "",
        image_url: values.image_url,
        colours: values.colours,
        is_published: values.is_published,
      };

      if (values.id) {
        // Update
        const { data, error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", values.id)
          .select()
          .single();

        if (error) throw error;

        setCollections((prev) =>
          prev.map((c) => (c.id === values.id ? (data as Collection) : c))
        );
      } else {
        // Insert
        const { data, error } = await supabase
          .from("categories")
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setCollections((prev) => [data as Collection, ...prev]);
      }

      setIsFormOpen(false);
      reset();
    } catch (err) {
      alert("Failed to save collection: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-brand-ivory tracking-wide flex items-center gap-2">
            <Layers className="h-7 w-7 text-brand-gold" />
            <span>Manage Collections</span>
          </h1>
          <p className="text-xs text-brand-grey font-sans">
            Create and edit stone classifications, color palettes, and portfolio details.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory hover:text-brand-charcoal transition-colors duration-300 font-sans text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 rounded-none"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="h-[1px] w-full bg-brand-gold/15" />

      {/* Search & Statistics Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A18] border border-brand-gold/10 focus:border-brand-gold pl-11 pr-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/40"
            placeholder="Search collections..."
          />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-brand-grey font-sans">
          Total Collections: <span className="text-brand-gold font-bold">{collections.length}</span>
        </div>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCollections.map((col) => (
          <div
            key={col.id}
            className="bg-[#1A1A18] border border-brand-gold/10 p-6 flex gap-6 relative shadow-lg group hover:border-brand-gold/30 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-brand-charcoal border border-brand-gold/10 shrink-0 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={col.image_url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"}
                alt={col.name}
                className="w-full h-full object-cover opacity-80"
              />
              {!col.is_published && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-[8px] uppercase tracking-widest text-red-400 border border-red-500/30 px-1.5 py-0.5 font-bold font-sans bg-brand-charcoal/80">
                    Draft
                  </span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="flex-grow space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-widest text-brand-gold font-semibold font-sans">
                  Slug: {col.slug}
                </span>
                <h3 className="font-serif text-xl text-brand-ivory leading-tight font-medium tracking-wide">
                  {col.name}
                </h3>
                <p className="text-[11px] text-brand-grey font-sans line-clamp-2 leading-relaxed">
                  {col.description || "No description provided."}
                </p>
              </div>

              {/* Colours list */}
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-wider text-brand-grey font-sans block">
                  Colours:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {col.colours && col.colours.length > 0 ? (
                    col.colours.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 border border-brand-gold/20 bg-brand-gold/5 text-[9px] font-sans text-brand-gold"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] font-sans text-brand-grey italic">No colours defined</span>
                  )}
                </div>
              </div>

              {/* CRUD Actions */}
              <div className="flex gap-4 pt-2 border-t border-brand-gold/10 justify-end">
                <button
                  onClick={() => handleEdit(col)}
                  className="flex items-center gap-1 text-[10px] uppercase font-sans tracking-widest text-brand-grey hover:text-brand-gold transition-colors"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(col.id)}
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

      {/* Slide-out Overlay Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-brand-charcoal h-full border-l border-brand-gold/10 p-8 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-brand-gold/15">
                <h3 className="font-serif text-2xl text-brand-ivory tracking-wide">
                  {editingCollection ? "Edit Collection" : "Create Collection"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-brand-grey hover:text-brand-gold transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    onChange={(e) => {
                      register("name").onChange(e);
                      // Auto slugify on create
                      if (!editingCollection) {
                        setValue(
                          "slug",
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)+/g, "")
                        );
                      }
                    }}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                    placeholder="E.g., Italian Marbles"
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-400 block">{errors.name.message}</span>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Slug Link (URL key)
                  </label>
                  <input
                    type="text"
                    {...register("slug")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                    placeholder="italian-marbles"
                  />
                  {errors.slug && (
                    <span className="text-[10px] text-red-400 block">{errors.slug.message}</span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    {...register("description")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25 resize-none"
                    placeholder="Highlight veining patterns or sourcing detail..."
                  />
                </div>

                {/* Image URL & File Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Cover Image
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

                {/* Colours Selection (Feature Request) */}
                <div className="space-y-3 p-4 border border-brand-gold/10 bg-[#1A1A18] rounded-none">
                  <label className="text-[10px] uppercase tracking-wider text-brand-gold font-bold block font-sans">
                    Collection Colors Palette
                  </label>

                  {/* Preset Checkbox Grid */}
                  <div className="grid grid-cols-3 gap-2 pb-3 border-b border-brand-gold/10">
                    {PRESET_COLOURS.map((col) => {
                      const isChecked = watchedColours.includes(col);
                      return (
                        <button
                          type="button"
                          key={col}
                          onClick={() => handleTogglePresetColour(col)}
                          className={`px-3 py-1.5 border text-[10px] font-sans tracking-wide uppercase flex items-center justify-between transition-colors ${
                            isChecked
                              ? "border-brand-gold bg-brand-gold/10 text-brand-gold font-semibold"
                              : "border-brand-gold/20 bg-brand-charcoal text-brand-grey"
                          }`}
                        >
                          <span>{col}</span>
                          {isChecked && <span className="text-[8px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Colour Tag Add */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase text-brand-grey block font-sans">
                      Add Custom Color:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customColour}
                        onChange={(e) => setCustomColour(e.target.value)}
                        className="flex-grow bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3 py-1.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                        placeholder="E.g., Emerald, Golden Yellow"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomColour}
                        className="px-4 py-1.5 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory text-[10px] font-sans uppercase font-bold tracking-wider"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Render all selected tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {watchedColours.map((col) => (
                      <span
                        key={col}
                        className="px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/30 text-[9px] font-sans text-brand-gold flex items-center gap-1.5"
                      >
                        <span>{col}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColour(col)}
                          className="hover:text-red-400 transition-colors font-sans text-[8px] font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.colours && (
                    <span className="text-[10px] text-red-400 block">{errors.colours.message}</span>
                  )}
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
                    Publish this collection immediately (visible on public sitemap filters)
                  </label>
                </div>

                {/* Submit button inside form */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 py-4 bg-brand-gold text-brand-charcoal font-bold font-sans text-xs tracking-widest uppercase hover:bg-brand-ivory transition-colors flex items-center justify-center gap-2 rounded-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Saving Collection...</span>
                    </>
                  ) : (
                    <span>Save Collection Details</span>
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
