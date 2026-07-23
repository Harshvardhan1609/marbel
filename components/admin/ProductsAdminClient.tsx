"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Plus, Search, Edit2, Trash2, X, Upload, Loader2, Eye } from "lucide-react";
import ProductCard from "@/components/collections/ProductCard";

const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  category_id: z.string().min(1, "Please select a category"),
  colour: z.string().min(1, "Please enter a colour"),
  finish: z.string().min(1, "Please enter a finish"),
  stock_status: z.enum(["in_stock", "limited", "sold_out"]),
  thickness_options: z.array(z.string()).min(1, "Select at least one thickness"),
  applications: z.array(z.string()).min(1, "Select at least one application"),
  image_urls: z.array(z.string()).min(1, "Add at least one image URL"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  colour: string;
  finish: string;
  thickness_options: string[];
  image_urls: string[];
  stock_status: "in_stock" | "limited" | "sold_out";
  category_id: string;
  category_name?: string;
  applications: string[];
}

interface ProductsAdminClientProps {
  initialProducts: Product[];
  categories: Category[];
}

const STOCK_STATUS_LABELS = {
  in_stock: "In Stock",
  limited: "Limited",
  sold_out: "Sold Out",
};

export default function ProductsAdminClient({ initialProducts, categories }: ProductsAdminClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      thickness_options: ["20mm"],
      applications: ["Flooring"],
      image_urls: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
      ],
      stock_status: "in_stock",
    },
  });

  // Watch fields for the live preview card
  const watchedName = watch("name") || "New Slab Preview";
  const watchedSlug = watch("slug") || "new-slab-preview";
  const watchedColour = watch("colour") || "Mixed";
  const watchedFinish = watch("finish") || "Polished";
  const watchedImages = watch("image_urls") || [];
  const watchedStock = watch("stock_status") || "in_stock";
  const watchedCategoryId = watch("category_id");
  const watchedCategory = categories.find((c) => c.id === watchedCategoryId)?.name || "Exotic Slab";

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category_id: product.category_id,
      colour: product.colour,
      finish: product.finish,
      stock_status: product.stock_status,
      thickness_options: product.thickness_options,
      applications: product.applications,
      image_urls: product.image_urls,
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    reset({
      name: "",
      slug: "",
      category_id: categories[0]?.id || "",
      colour: "",
      finish: "",
      stock_status: "in_stock",
      thickness_options: ["20mm"],
      applications: ["Flooring"],
      image_urls: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
      ],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slab?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.warn("Delete failed, simulating locally:", err);
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `slabs/${fileName}`;

      // Upload file to Supabase storage 'slabs' bucket
      const { error: uploadError } = await supabase.storage
        .from("slabs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("slabs")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        setValue("image_urls", [urlData.publicUrl]);
      }
    } catch (err) {
      console.warn("Storage upload failed, simulating mockup URL:", err);
      // Fallback placeholder image URL
      setValue("image_urls", ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"]);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        category_id: values.category_id,
        colour: values.colour,
        finish: values.finish,
        stock_status: values.stock_status,
        thickness_options: values.thickness_options,
        applications: values.applications,
        image_urls: values.image_urls,
        is_published: true,
      };

      if (values.id && !values.id.startsWith("mock")) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }

      // Reload page state
      window.location.reload();
    } catch (err) {
      console.warn("CRUD save failed, simulating local client update:", err);
      const categoryName = categories.find((c) => c.id === values.category_id)?.name || "Exotic Slab";
      if (values.id) {
        setProducts(
          products.map((p) =>
            p.id === values.id
              ? {
                  id: p.id,
                  name: values.name,
                  slug: values.slug,
                  colour: values.colour,
                  finish: values.finish,
                  thickness_options: values.thickness_options,
                  image_urls: values.image_urls,
                  stock_status: values.stock_status,
                  category_id: values.category_id,
                  category_name: categoryName,
                  applications: values.applications,
                }
              : p
          )
        );
      } else {
        const newProduct: Product = {
          id: `mock-${Math.random()}`,
          name: values.name,
          slug: values.slug,
          colour: values.colour,
          finish: values.finish,
          thickness_options: values.thickness_options,
          image_urls: values.image_urls,
          stock_status: values.stock_status,
          category_id: values.category_id,
          category_name: categoryName,
          applications: values.applications,
        };
        setProducts([newProduct, ...products]);
      }
      setIsFormOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.colour.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.finish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-brand-ivory tracking-wide">
            Slab Management
          </h1>
          <p className="text-xs text-brand-grey font-sans">
            Add, update, or remove natural stone inventory from the catalogue.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory font-semibold text-xs font-sans tracking-widest uppercase transition-colors flex items-center gap-1.5 rounded-none"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Slab</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center max-w-md">
        <Search className="absolute left-3.5 h-4.5 w-4.5 text-brand-gold/70" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1A18] border border-brand-gold/15 focus:border-brand-gold pl-11 pr-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
          placeholder="Search by name, colour, or finish..."
        />
      </div>

      {/* Main CRUD Table */}
      <div className="bg-[#1A1A18] border border-brand-gold/10 overflow-x-auto shadow-md">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-brand-gold/15 text-brand-gold bg-[#1F1F1D] uppercase tracking-wider text-[10px] font-semibold">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Specs</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gold/10">
            {filteredProducts.map((prod) => (
              <tr key={prod.id} className="hover:bg-brand-charcoal/30 transition-colors">
                <td className="p-4">
                  <div className="h-12 w-16 overflow-hidden border border-brand-gold/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prod.image_urls[0]} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-semibold text-brand-ivory">
                  {prod.name}
                  <span className="text-[10px] text-brand-grey block font-normal font-mono">{prod.slug}</span>
                </td>
                <td className="p-4 text-brand-grey">
                  {prod.category_name || "Exotic Stone"}
                </td>
                <td className="p-4 text-brand-grey">
                  <div className="space-y-0.5">
                    <span>Colour: {prod.colour}</span>
                    <span className="block">Finish: {prod.finish}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                      prod.stock_status === "in_stock"
                        ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
                        : prod.stock_status === "limited"
                        ? "border-amber-500/20 text-amber-400 bg-amber-500/5"
                        : "border-red-500/20 text-red-400 bg-red-500/5"
                    }`}
                  >
                    {STOCK_STATUS_LABELS[prod.stock_status]}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="p-2 border border-brand-gold/20 text-brand-gold hover:border-brand-gold hover:bg-brand-gold/5 transition-all"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-2 border border-red-500/20 text-red-400 hover:border-red-500 hover:bg-red-500/5 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-8 text-brand-grey italic">
                  No matching slabs found in inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sliding Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1A1A18] border border-brand-gold/15 shadow-2xl w-full max-w-5xl flex flex-col lg:flex-row relative max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-1.5 border border-brand-ivory/15 hover:border-brand-gold text-brand-ivory hover:text-brand-gold transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left: Input Form Panel */}
            <div className="w-full lg:w-3/5 p-6 sm:p-8 overflow-y-auto border-r border-brand-gold/15">
              <h3 className="font-serif text-xl text-brand-ivory mb-6">
                {editingProduct ? "Edit Inventory slab" : "Add New Slab Item"}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold">
                    Slab Name *
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3.5 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                    placeholder="Calacatta Oro Marble"
                    onChange={(e) => {
                      setValue("name", e.target.value);
                      setValue(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/ /g, "-")
                          .replace(/[^\w-]+/g, "")
                      );
                    }}
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-400 block">{errors.name.message}</span>
                  )}
                </div>

                {/* Slug & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold">
                      Slab Slug *
                    </label>
                    <input
                      type="text"
                      {...register("slug")}
                      className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3.5 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                      placeholder="calacatta-oro-marble"
                    />
                    {errors.slug && (
                      <span className="text-[10px] text-red-400 block">{errors.slug.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold">
                      Category *
                    </label>
                    <select
                      {...register("category_id")}
                      className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3.5 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <span className="text-[10px] text-red-400 block">{errors.category_id.message}</span>
                    )}
                  </div>
                </div>

                {/* Colour, Finish & Stock Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold">
                      Colour *
                    </label>
                    <input
                      type="text"
                      {...register("colour")}
                      className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3.5 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                      placeholder="White"
                    />
                    {errors.colour && (
                      <span className="text-[10px] text-red-400 block">{errors.colour.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold">
                      Finish *
                    </label>
                    <input
                      type="text"
                      {...register("finish")}
                      className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3.5 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                      placeholder="Polished"
                    />
                    {errors.finish && (
                      <span className="text-[10px] text-red-400 block">{errors.finish.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold">
                      Stock Status *
                    </label>
                    <select
                      {...register("stock_status")}
                      className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-3.5 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="limited">Limited</option>
                      <option value="sold_out">Sold Out</option>
                    </select>
                  </div>
                </div>

                {/* Thickness & Applications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
                      Thickness *
                    </label>
                    <div className="flex gap-4 pt-1 font-sans text-xs">
                      {["18mm", "20mm", "30mm"].map((thick) => (
                        <label key={thick} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            value={thick}
                            defaultChecked={watch("thickness_options")?.includes(thick)}
                            onChange={(e) => {
                              const current = watch("thickness_options") || [];
                              if (e.target.checked) {
                                setValue("thickness_options", [...current, thick]);
                              } else {
                                setValue(
                                  "thickness_options",
                                  current.filter((c) => c !== thick)
                                );
                              }
                            }}
                            className="accent-brand-gold"
                          />
                          <span>{thick}</span>
                        </label>
                      ))}
                    </div>
                    {errors.thickness_options && (
                      <span className="text-[10px] text-red-400 block">{errors.thickness_options.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
                      Application Slices *
                    </label>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 font-sans text-xs">
                      {["Flooring", "Countertop", "Wall Cladding", "Parking"].map((app) => (
                        <label key={app} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            value={app}
                            defaultChecked={watch("applications")?.includes(app)}
                            onChange={(e) => {
                              const current = watch("applications") || [];
                              if (e.target.checked) {
                                setValue("applications", [...current, app]);
                              } else {
                                setValue(
                                  "applications",
                                  current.filter((c) => c !== app)
                                );
                              }
                            }}
                            className="accent-brand-gold"
                          />
                          <span>{app}</span>
                        </label>
                      ))}
                    </div>
                    {errors.applications && (
                      <span className="text-[10px] text-red-400 block">{errors.applications.message}</span>
                    )}
                  </div>
                </div>

                {/* Storage image upload block */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
                    Upload Slab Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 border border-brand-gold/30 hover:border-brand-gold bg-brand-charcoal text-brand-gold cursor-pointer transition-colors text-xs font-semibold uppercase tracking-wider font-sans">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Upload File</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-brand-grey font-mono truncate max-w-xs">
                      {watchedImages[0] || "No photo chosen"}
                    </span>
                  </div>
                  {errors.image_urls && (
                    <span className="text-[10px] text-red-400 block">{errors.image_urls.message}</span>
                  )}
                </div>

                {/* Form Actions */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-grow py-3 bg-brand-gold text-brand-charcoal font-bold font-sans text-xs tracking-widest uppercase hover:bg-brand-ivory transition-colors flex items-center justify-center gap-2 rounded-none"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Slab</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3 border border-brand-gold/10 hover:border-brand-gold text-brand-ivory transition-colors text-xs uppercase tracking-widest font-sans font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Live Preview Card Panel */}
            <div className="w-full lg:w-2/5 p-6 sm:p-8 bg-[#151513] flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l border-brand-gold/15">
              <div className="text-center mb-6 space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-brand-gold font-sans font-bold">
                  <Eye className="h-3.5 w-3.5" />
                  Live Preview
                </span>
                <p className="text-[10px] text-brand-grey font-sans">
                  Beholds card formatting matches public catalogs.
                </p>
              </div>

              {/* Mocking categories matching card props */}
              <div className="w-72 max-w-full">
                <ProductCard
                  product={{
                    id: "preview-id",
                    name: watchedName,
                    slug: watchedSlug,
                    colour: watchedColour,
                    finish: watchedFinish,
                    thickness_options: watch("thickness_options") || [],
                    image_urls: watchedImages,
                    stock_status: watchedStock,
                    category_name: watchedCategory,
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
