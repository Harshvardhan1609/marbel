"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "New" | "Contacted" | "Converted" | "Lost";
  created_at: string;
  product_name: string | null;
}

interface EnquiriesAdminClientProps {
  initialEnquiries: Enquiry[];
}

const STATUS_OPTIONS: ("New" | "Contacted" | "Converted" | "Lost")[] = [
  "New",
  "Contacted",
  "Converted",
  "Lost",
];

const STATUS_COLORS = {
  New: "border-blue-500/20 text-blue-400 bg-blue-500/5",
  Contacted: "border-amber-500/20 text-amber-400 bg-amber-500/5",
  Converted: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
  Lost: "border-red-500/20 text-red-400 bg-red-500/5",
};

export default function EnquiriesAdminClient({ initialEnquiries }: EnquiriesAdminClientProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "New" | "Contacted" | "Converted" | "Lost">("All");

  const supabase = createClient();

  const handleStatusChange = async (id: string, newStatus: "New" | "Contacted" | "Converted" | "Lost") => {
    try {
      const { error } = await supabase
        .from("enquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setEnquiries(
        enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.warn("Failed to update status in Supabase, simulating locally:", err);
      setEnquiries(
        enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    }
  };

  const filteredEnquiries = enquiries
    .filter((e) => activeFilter === "All" || e.status === activeFilter)
    .filter(
      (e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif text-brand-ivory tracking-wide">
          Enquiries Inbox
        </h1>
        <p className="text-xs text-brand-grey font-sans">
          Review leads, track consultations, and update customer status tags.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative flex items-center max-w-md w-full">
          <Search className="absolute left-3.5 h-4.5 w-4.5 text-brand-gold/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A18] border border-brand-gold/15 focus:border-brand-gold pl-11 pr-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
            placeholder="Search by client name, email, or message..."
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2">
          {(["All", ...STATUS_OPTIONS] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 text-xs font-sans tracking-wider uppercase border transition-all ${
                activeFilter === tab
                  ? "border-brand-gold bg-brand-gold text-brand-charcoal font-semibold"
                  : "border-brand-gold/10 hover:border-brand-gold text-brand-grey"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox leads list */}
      <div className="space-y-4">
        {filteredEnquiries.map((enq) => (
          <div
            key={enq.id}
            className="bg-[#1A1A18] border border-brand-gold/10 hover:border-brand-gold/25 p-6 shadow-md transition-colors space-y-4 relative"
          >
            {/* Header: Name and Status Select */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-serif text-lg text-brand-ivory font-semibold tracking-wide">
                  {enq.name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-[10px] text-brand-grey font-sans uppercase tracking-widest mt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-brand-gold" />
                    {enq.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-brand-gold" />
                    {enq.phone || "No phone number"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-gold" />
                    {new Date(enq.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Status Select dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-brand-grey font-sans font-bold">
                  Status:
                </span>
                <select
                  value={enq.status}
                  onChange={(e) =>
                    handleStatusChange(enq.id, e.target.value as "New" | "Contacted" | "Converted" | "Lost")
                  }
                  className={`px-3 py-1.5 text-xs font-sans border rounded-none focus:outline-none cursor-pointer uppercase tracking-wider font-semibold ${
                    STATUS_COLORS[enq.status]
                  }`}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1A1A18] text-brand-ivory">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message Details */}
            <div className="bg-brand-charcoal/50 border border-brand-gold/5 p-4 text-xs font-sans text-brand-grey leading-relaxed">
              {enq.message}
            </div>

            {/* Associated Product Tag */}
            {enq.product_name && (
              <div className="flex items-center gap-1.5 text-[10px] font-sans text-brand-gold font-bold uppercase tracking-wider">
                <ShoppingBag className="h-4 w-4" />
                <span>Requested Slab: {enq.product_name}</span>
              </div>
            )}
          </div>
        ))}

        {filteredEnquiries.length === 0 && (
          <div className="bg-[#1A1A18] border border-brand-gold/10 p-12 text-center text-brand-grey italic font-sans text-xs">
            No customer enquiries match this filter selection.
          </div>
        )}
      </div>
    </div>
  );
}
