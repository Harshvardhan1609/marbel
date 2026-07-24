import { createClient } from "@/lib/supabase/server";
import CollectionsAdminClient from "@/components/admin/CollectionsAdminClient";

export const dynamic = "force-dynamic";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  colours: string[];
  is_published: boolean;
}

export default async function AdminCollectionsPage() {
  let collections: Collection[] = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, image_url, colours, is_published")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data) {
      collections = data;
    }
  } catch (err) {
    console.error("Failed to query collections in admin:", err);
  }

  return <CollectionsAdminClient initialCollections={collections} />;
}
