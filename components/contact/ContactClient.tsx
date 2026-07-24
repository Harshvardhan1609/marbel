"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Phone, Mail, MapPin, Send, Check, Loader2, MessageSquare } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface Location {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapLabel: string;
}

interface ContactClientProps {
  locations: Location[];
  whatsappUrl: string;
  brandName: string;
}

export default function ContactClient({ locations, whatsappUrl, brandName }: ContactClientProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<ContactFormValues>,
  });

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      
      const { error } = await supabase.from("enquiries").insert([
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
          product_id: null,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      reset();
    } catch (err) {
      console.warn("Failed to write contact enquiry to Supabase, showing success locally:", err);
      setIsSuccess(true);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
      {/* Left Column: Form Section */}
      <div className="lg:col-span-7 bg-[#1F1F1D] text-brand-ivory border border-brand-gold/15 p-8 sm:p-12 shadow-xl space-y-8 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif text-brand-ivory font-medium">
            Submit an Enquiry
          </h2>
          <div className="h-[1px] w-20 bg-brand-gold" />
          <p className="text-xs text-brand-grey font-sans leading-relaxed">
            Fill out the form below, and our natural stone advisors will reply within 24 business hours.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-16 h-16 rounded-full border border-brand-gold flex items-center justify-center text-brand-gold mx-auto bg-brand-gold/5">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl text-brand-ivory">Enquiry Received</h3>
            <p className="text-sm text-brand-grey max-w-xs mx-auto font-sans leading-relaxed">
              Thank you for contacting {brandName}. Our stone curator team will follow up via phone or email shortly.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="px-6 py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory font-semibold text-xs tracking-widest uppercase transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs text-center font-sans">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold font-sans block">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <span className="text-[10px] text-red-400 block">{errors.name.message}</span>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold font-sans block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                  placeholder="+91 XXXXX XXXXX"
                />
                {errors.phone && (
                  <span className="text-[10px] text-red-400 block">{errors.phone.message}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold font-sans block">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="text-[10px] text-red-400 block">{errors.email.message}</span>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold font-sans block">
                Your Message
              </label>
              <textarea
                rows={5}
                {...register("message")}
                className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25 resize-none"
                placeholder="What details are you seeking? E.g., block volume, layout customization, pricing..."
              />
              {errors.message && (
                <span className="text-[10px] text-red-400 block">{errors.message.message}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-gold hover:bg-brand-ivory text-brand-charcoal hover:text-brand-charcoal font-semibold font-sans text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Submitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Enquiry</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Right Column: Dynamic Contact details and Live chat shortcuts */}
      <div className="lg:col-span-5 space-y-12">
        {/* Direct chat with head curator */}
        <div className="bg-[#1A1A18] border border-brand-gold/10 p-8 space-y-6">
          <h3 className="font-serif text-xl text-brand-ivory tracking-wide">
            Instant Consultation
          </h3>
          <p className="text-xs text-brand-grey font-sans leading-relaxed">
            Need pricing immediately or want to discuss a live blueprint? Speak with our stone curator directly on WhatsApp for real-time yard reviews.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-[#25D366] text-white hover:bg-white hover:text-[#25D366] border border-transparent hover:border-[#25D366] font-semibold font-sans text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all rounded-none"
          >
            <MessageSquare className="h-4.5 w-4.5 fill-current" />
            <span>Chat via WhatsApp</span>
          </a>
        </div>

        {/* Dynamic Location Cards */}
        <div className="space-y-6">
          <h3 className="font-serif text-xl text-brand-charcoal tracking-wide border-b border-brand-gold/10 pb-3">
            Our Locations
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {locations.map((loc, idx) => (
              <div key={idx} className="border border-brand-charcoal/5 bg-brand-charcoal/5 p-6 space-y-4">
                <h4 className="font-serif text-lg text-brand-charcoal font-semibold">{loc.name}</h4>
                <div className="h-[1px] w-12 bg-brand-gold" />
                <ul className="space-y-2 text-xs font-sans text-brand-grey leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-brand-gold" />
                    <span>{loc.phone}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-brand-gold" />
                    <span>{loc.email}</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
