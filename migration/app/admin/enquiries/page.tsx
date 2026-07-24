import { createClient } from "@/lib/supabase/server";
import EnquiriesAdminClient from "@/components/admin/EnquiriesAdminClient";

export const dynamic = "force-dynamic";

const MOCK_ENQUIRIES = [
  {
    id: "enq-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    message: "Thickness: 18mm | Finish: Polished | Area: 1500 sqft\n\nLooking for Calacatta Oro price per sqft. Can you send catalog files?",
    status: "New" as const,
    created_at: new Date().toISOString(),
    product_name: "Calacatta Oro Marble",
  },
  {
    id: "enq-2",
    name: "Sarah Khan",
    email: "sarah@example.com",
    phone: "+91 98765 11111",
    message: "Thickness: 20mm | Finish: Leathered | Area: 800 sqft\n\nNeed Emerald Quartzite pricing and delivery options to Jaipur showroom.",
    status: "Contacted" as const,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    product_name: "Emerald Quartzite",
  },
  {
    id: "enq-3",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 22222",
    message: "Interested in discussing pricing options for premium flooring stones. Need consultation for commercial tower lobby.",
    status: "Converted" as const,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    product_name: null,
  },
];

export default async function AdminEnquiriesPage() {
  let enquiries = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("enquiries")
      .select("id, name, email, phone, message, status, created_at, products(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      enquiries = data.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone || "",
        message: e.message || "",
        status: (e.status || "New") as "New" | "Contacted" | "Converted" | "Lost",
        created_at: e.created_at,
        product_name: (e.products as unknown as { name: string } | null)?.name || null,
      }));
    } else {
      enquiries = MOCK_ENQUIRIES;
    }
  } catch (err) {
    console.error("Failed to query enquiries from Supabase, using mock inbox:", err);
    enquiries = MOCK_ENQUIRIES;
  }

  return <EnquiriesAdminClient initialEnquiries={enquiries} />;
}
