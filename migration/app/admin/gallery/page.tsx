import { createClient } from "@/lib/supabase/server";
import GalleryAdminClient from "@/components/admin/GalleryAdminClient";

export const dynamic = "force-dynamic";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  category: string;
  order_index: number;
  is_published: boolean;
}

export default async function AdminGalleryPage() {
  let gallery: GalleryItem[] = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id, title, description, image_url, category, order_index, is_published")
      .order("order_index", { ascending: true });

    if (error) throw error;
    if (data) {
      gallery = data;
    }
  } catch (err) {
    console.error("Failed to query gallery items in admin:", err);
  }

  return <GalleryAdminClient initialGallery={gallery} />;
}
