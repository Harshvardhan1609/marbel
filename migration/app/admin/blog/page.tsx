import { createClient } from "@/lib/supabase/server";
import BlogAdminClient from "@/components/admin/BlogAdminClient";

export const dynamic = "force-dynamic";

// Typed Mock Database matching blog page.tsx
const MOCK_POSTS = [
  {
    id: "post-1",
    title: "The Art of Bookmatching Marble Slabs",
    slug: "art-of-bookmatching",
    excerpt: "How bookmatching slices marble blocks to reveal mirrored veins that create symmetrical, breathtaking wall features.",
    body_markdown: "# The Art of Bookmatching Marble Slabs\n\nBookmatching is the practice of matching two or more stone surfaces, so that two adjoining surfaces mirror each other, giving the impression of an opened book.",
    cover_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    is_published: true,
    created_at: "2024-06-15T12:00:00Z",
  },
  {
    id: "post-2",
    title: "Quartzite vs. Granite: Sourcing for Kitchen Islands",
    slug: "quartzite-vs-granite",
    excerpt: "Comparing density, porosity, and design options between quartzite and granite slabs for luxury kitchen countertops.",
    body_markdown: "# Quartzite vs. Granite: Kitchen Countertops\n\nWhen sourcing material for high-end kitchen islands, the eternal debate often centers on Quartzite versus Granite. Both offer extraordinary beauty...",
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    is_published: true,
    created_at: "2024-07-02T10:30:00Z",
  },
];

export default async function AdminBlogPage() {
  let posts = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, body_markdown, cover_image, is_published, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      posts = data.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || "",
        body_markdown: p.body_markdown || "",
        cover_image: p.cover_image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
        is_published: p.is_published,
        created_at: p.created_at,
      }));
    } else {
      posts = MOCK_POSTS;
    }
  } catch (err) {
    console.error("Failed to query blog posts from Supabase, using mock inventory:", err);
    posts = MOCK_POSTS;
  }

  return <BlogAdminClient initialPosts={posts} />;
}
