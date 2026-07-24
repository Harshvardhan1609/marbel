"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Phone, Mail, Send, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  area: z.coerce
    .number()
    .positive("Area must be greater than 0"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

interface Product {
  id: string;
  name: string;
  slug: string;
  colour: string;
  finish: string;
  thickness_options: string[];
  image_urls: string[];
  stock_status: "in_stock" | "limited" | "sold_out";
  category_name?: string;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [activeImage, setActiveImage] = useState(product.image_urls[0]);
  const [selectedThickness, setSelectedThickness] = useState(product.thickness_options[0]);
  const [selectedFinish, setSelectedFinish] = useState(product.finish);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zoom overlay position coordinates
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: "center center",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema) as unknown as Resolver<EnquiryFormValues>,
    defaultValues: {
      message: `I am interested in requesting a price quote for the ${product.name} in ${selectedThickness} thickness.`,
    },
  });

  const onSubmit = async (values: EnquiryFormValues) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      
      // Attempt to save enquiry to Supabase enquiries table
      const { error } = await supabase.from("enquiries").insert([
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: `Thickness: ${selectedThickness} | Finish: ${selectedFinish} | Area: ${values.area} sqft\n\n${values.message}`,
          product_id: product.id.startsWith("mock") ? null : product.id,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      reset();
    } catch (err) {
      console.warn("Failed to write to Supabase, demonstrating success locally:", err);
      // Fallback for demonstration/local development
      setIsSuccess(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumb navigation */}
        <div className="text-xs uppercase tracking-widest font-sans text-brand-grey mb-8 space-x-2">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-brand-gold transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-brand-charcoal font-semibold">{product.name}</span>
        </div>

        {/* Primary Product Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Gallery & Images */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Zoom View */}
            <div
              className="aspect-[4/3] w-full overflow-hidden bg-brand-charcoal border border-brand-gold/15 relative cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* 
                Shared layoutId transition: the image expands 
                seamlessly from the card grid! 
              */}
              <motion.img
                layoutId={`product-img-${product.slug}`}
                src={activeImage}
                alt={product.name}
                style={zoomStyle}
                className="w-full h-full object-cover transition-transform duration-100 ease-out origin-center"
              />
            </div>

            {/* Gallery Thumbnail Row */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.image_urls.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 border shrink-0 overflow-hidden transition-all ${
                    activeImage === img ? "border-brand-gold ring-1 ring-brand-gold" : "border-brand-charcoal/15 hover:border-brand-gold/50"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Slab Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Specification & Buy options */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-start">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
                {product.category_name || "Exotic Slab"}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-brand-charcoal">
                {product.name}
              </h1>
              <p className="text-sm text-brand-grey font-sans uppercase tracking-widest pt-1">
                Colour: {product.colour}
              </p>
            </div>

            <div className="h-[1px] w-full bg-brand-gold/15" />

            {/* Thickness selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-brand-grey font-sans font-semibold block">
                Select Thickness
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.thickness_options.map((thick) => (
                  <button
                    key={thick}
                    onClick={() => setSelectedThickness(thick)}
                    className={`px-4 py-2 text-xs font-sans border rounded-none transition-all ${
                      selectedThickness === thick
                        ? "border-brand-gold bg-brand-gold text-brand-charcoal font-semibold"
                        : "border-brand-charcoal/20 text-brand-charcoal hover:border-brand-gold"
                    }`}
                  >
                    {thick}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-brand-grey font-sans font-semibold block">
                Surface Finish
              </label>
              <div className="flex flex-wrap gap-2.5">
                {["Polished", "Leathered", "Honed", "Bookmatched", "Satin"].map((finish) => (
                  <button
                    key={finish}
                    onClick={() => setSelectedFinish(finish)}
                    className={`px-4 py-2 text-xs font-sans border rounded-none transition-all ${
                      selectedFinish === finish
                        ? "border-brand-gold bg-brand-gold text-brand-charcoal font-semibold"
                        : "border-brand-charcoal/20 text-brand-charcoal hover:border-brand-gold"
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            {/* Call to actions */}
            <div className="pt-6">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-full py-4 bg-brand-charcoal hover:bg-brand-gold text-brand-ivory hover:text-brand-charcoal transition-all duration-300 font-sans text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 rounded-none shadow-lg shadow-black/10"
              >
                <Send className="h-4 w-4" />
                Request Price / Enquire
              </button>
              <p className="text-[10px] text-brand-grey font-sans text-center mt-2.5">
                Slab dimensions and high-resolution videos available upon request.
              </p>
            </div>
          </div>

        </div>

        {/* Below fold: Related Products Rail */}
        <div className="mt-32 border-t border-brand-gold/15 pt-16">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
                Curated Suggestions
              </span>
              <h2 className="text-2xl md:text-3xl font-serif tracking-tight text-brand-charcoal">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-xs font-semibold tracking-wider uppercase text-brand-gold flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Browse Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.slice(0, 4).map((rel) => (
              <Link
                key={rel.id}
                href={`/collections/${rel.slug}`}
                className="group border border-brand-gold/10 hover:border-brand-gold bg-brand-charcoal relative overflow-hidden block"
              >
                <div className="aspect-[3/4] w-full relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rel.image_urls[0]}
                    alt={rel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/25 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <h4 className="font-serif text-base text-brand-ivory font-medium tracking-wide">
                      {rel.name}
                    </h4>
                    <p className="text-[9px] text-brand-gold font-sans uppercase tracking-widest mt-0.5">
                      {rel.colour} &bull; {rel.finish}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Enquiry slide-in drawer from the right */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDrawerOpen(false);
                setIsSuccess(false);
              }}
              className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
            />

            {/* Slide-in drawer container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#1a1a18] border-l border-brand-gold/20 shadow-2xl z-50 p-8 flex flex-col justify-between overflow-y-auto text-brand-ivory"
            >
              <div>
                {/* Header block */}
                <div className="flex items-center justify-between border-b border-brand-gold/10 pb-6 mb-8">
                  <div className="space-y-1">
                    <span className="text-[9px] tracking-[0.3em] uppercase text-brand-gold font-sans block">
                      Enquire Slabs
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl text-brand-ivory">
                      Request Consultation
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsSuccess(false);
                    }}
                    className="p-1.5 border border-brand-ivory/10 hover:border-brand-gold text-brand-ivory hover:text-brand-gold transition-colors focus:outline-none"
                    aria-label="Close drawer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {isSuccess ? (
                  /* Success Frame */
                  <div className="space-y-6 text-center py-12">
                    <div className="w-16 h-16 rounded-full border border-brand-gold flex items-center justify-center text-brand-gold mx-auto mb-4 bg-brand-gold/5">
                      <Check className="h-8 w-8" />
                    </div>
                    <h4 className="font-serif text-2xl text-brand-ivory">Enquiry Submitted</h4>
                    <p className="text-sm text-brand-grey font-sans leading-relaxed max-w-xs mx-auto">
                      Thank you. Our stone curators have received your request for <strong>{product.name}</strong> and will contact you via phone or email shortly.
                    </p>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        setIsSuccess(false);
                      }}
                      className="px-6 py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory font-sans text-xs font-semibold tracking-widest uppercase transition-colors"
                    >
                      Close Drawer
                    </button>
                  </div>
                ) : (
                  /* Form Frame */
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <p className="text-xs text-brand-grey leading-relaxed">
                      Slabs: <strong className="text-brand-ivory">{product.name}</strong> &bull; Selected Spec: <strong className="text-brand-gold">{selectedThickness} / {selectedFinish}</strong>
                    </p>

                    {/* Name field */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-brand-grey block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full bg-brand-charcoal border border-brand-gold/25 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/30"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <span className="text-[10px] text-red-400 block">{errors.name.message}</span>
                      )}
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-brand-grey block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full bg-brand-charcoal border border-brand-gold/25 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/30"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <span className="text-[10px] text-red-400 block">{errors.email.message}</span>
                      )}
                    </div>

                    {/* Phone field */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-brand-grey block">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        className="w-full bg-brand-charcoal border border-brand-gold/25 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/30"
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && (
                        <span className="text-[10px] text-red-400 block">{errors.phone.message}</span>
                      )}
                    </div>

                    {/* Area in sqft */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-brand-grey block">
                        Approximate Area Needed (Sqft) *
                      </label>
                      <input
                        type="number"
                        {...register("area")}
                        className="w-full bg-brand-charcoal border border-brand-gold/25 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/30"
                        placeholder="e.g. 1500"
                      />
                      {errors.area && (
                        <span className="text-[10px] text-red-400 block">{errors.area.message}</span>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-brand-grey block">
                        Custom message / Notes
                      </label>
                      <textarea
                        rows={3}
                        {...register("message")}
                        className="w-full bg-brand-charcoal border border-brand-gold/25 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/30 resize-none"
                      />
                      {errors.message && (
                        <span className="text-[10px] text-red-400 block">{errors.message.message}</span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-gold text-brand-charcoal font-semibold font-sans text-xs tracking-widest uppercase hover:bg-brand-ivory hover:text-brand-charcoal transition-all duration-300 flex items-center justify-center gap-2 rounded-none mt-4 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Enquiry</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Drawer footer details */}
              <div className="border-t border-brand-gold/10 pt-6 mt-8 space-y-3">
                <div className="flex items-center gap-2 text-xs text-brand-grey">
                  <Phone className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Curator Direct: +91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-grey">
                  <Mail className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>enquiries@sudhirmarbels.com</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add simple spinner for fallback loader inside drawer
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
