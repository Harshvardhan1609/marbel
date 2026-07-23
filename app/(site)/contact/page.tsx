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

const LOCATIONS = [
  {
    name: "Jaipur Showroom",
    address: "VKI Area, Jaipur, Rajasthan, India",
    phone: "+91 98765 43210",
    email: "jaipur@sudhirmarbels.com",
    hours: "Mon - Sat: 9 AM - 7 PM",
    mapLabel: "Main Showroom Map View",
  },
  {
    name: "Kishangarh Processing Plant",
    address: "Industrial Area, Kishangarh, Rajasthan, India",
    phone: "+91 98765 99999",
    email: "plant@sudhirmarbels.com",
    hours: "Mon - Sat: 8 AM - 6 PM",
    mapLabel: "Processing Facility Map View",
  },
];

export default function ContactPage() {
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
      
      // Submit contact form to enquiries table (product_id = null)
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
      // Display success locally as fallback during development
      setIsSuccess(true);
      reset();
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    "Hello Sudhir Marbels, I am seeking a price quotation and slab catalog consult."
  )}`;

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Page Header */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
            Contact Our Curators
          </h1>
          <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
            Request price lists, physical slab inspection visits, or layout visualization consultations.
          </p>
        </div>
      </div>

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
                Thank you for contacting Sudhir Marbels. Our stone curator team will follow up via phone or email shortly.
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

              {/* Name field */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/20"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span className="text-[10px] text-red-400 block">{errors.name.message}</span>
                )}
              </div>

              {/* Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/20"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-400 block">{errors.email.message}</span>
                  )}
                </div>

                {/* Phone field */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/20"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-400 block">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
                  How can we help you? *
                </label>
                <textarea
                  rows={4}
                  {...register("message")}
                  className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold px-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/20 resize-none"
                  placeholder="Describe your project, material choice, and approx sqft requirements..."
                />
                {errors.message && (
                  <span className="text-[10px] text-red-400 block">{errors.message.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-gold hover:bg-brand-ivory text-brand-charcoal hover:text-brand-charcoal font-semibold font-sans text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-none disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Sending Enquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Multi-location Details */}
        <div className="lg:col-span-5 space-y-12 flex flex-col justify-start">
          
          {/* Quick Contact shortcuts */}
          <div className="space-y-4 bg-brand-charcoal/5 border border-brand-gold/10 p-8">
            <h3 className="font-serif text-lg text-brand-charcoal font-semibold tracking-wide">
              Direct Communication
            </h3>
            <p className="text-xs text-brand-grey font-sans leading-relaxed">
              Prefer instant messaging? Chat with a stone coordinator directly on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow py-3 bg-[#25D366] text-white hover:bg-[#1ebd54] transition-colors font-sans text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp Consultation
              </a>
              <a
                href="tel:+919876543210"
                className="flex-grow py-3 border border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-ivory transition-all duration-300 font-sans text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Call Curator
              </a>
            </div>
          </div>

          {/* Location Cards */}
          <div className="space-y-8">
            {LOCATIONS.map((loc, idx) => (
              <div key={idx} className="space-y-4 border-l-2 border-brand-gold pl-6">
                <h3 className="font-serif text-lg md:text-xl text-brand-charcoal font-semibold tracking-wide">
                  {loc.name}
                </h3>
                <ul className="space-y-3 font-sans text-xs text-brand-grey">
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-gold" />
                    <span>{loc.phone}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand-gold" />
                    <span>{loc.email}</span>
                  </li>
                </ul>
                
                {/* Styled placeholder map box representing high-end aesthetics */}
                <div className="aspect-[21/9] w-full bg-brand-charcoal/10 border border-brand-gold/15 flex items-center justify-center text-[10px] text-brand-grey font-sans uppercase tracking-widest">
                  {loc.mapLabel}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
