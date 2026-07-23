import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Clock, User, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body_markdown: string;
  cover_image: string;
  tag: string;
  created_at: string;
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "The Art of Bookmatching Marble Slabs",
    slug: "art-of-bookmatching",
    excerpt: "How bookmatching slices marble blocks to reveal mirrored veins that create symmetrical, breathtaking wall features.",
    body_markdown: "Content placeholder",
    cover_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    tag: "Marble",
    created_at: "2024-06-15T12:00:00Z",
  },
  {
    id: "post-2",
    title: "Quartzite vs. Granite: Sourcing for Kitchen Islands",
    slug: "quartzite-vs-granite",
    excerpt: "Comparing density, porosity, and design options between quartzite and granite slabs for luxury kitchen countertops.",
    body_markdown: "Content placeholder",
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    tag: "Quartzite",
    created_at: "2024-07-02T10:30:00Z",
  },
];

const TAGS = ["All", "Marble", "Quartzite", "Granite", "Design Guide"];

interface BlogPageProps {
  searchParams: {
    tag?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const activeTag = searchParams.tag || "All";
  
  let posts = [];

  try {
    const supabase = createClient();
    const query = supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, body_markdown, cover_image, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    if (data && data.length > 0) {
      posts = data.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || "",
        body_markdown: p.body_markdown,
        cover_image: p.cover_image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
        tag: p.title.toLowerCase().includes("quartzite") ? "Quartzite" : "Marble",
        created_at: p.created_at,
      }));
    } else {
      posts = MOCK_POSTS;
    }
  } catch (err) {
    console.error("Failed to query blog from Supabase, using mock articles:", err);
    posts = MOCK_POSTS;
  }

  // Filter posts in-memory for active tag
  const filteredPosts =
    activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Header Panel */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Stone Journal
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
            The Editorial Blog
          </h1>
          <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
            Discover design tips, geological insights, and guide tutorials on sourcing, processing, and installing luxury stone surfaces.
          </p>
        </div>
      </div>

      {/* Main Blog Body */}
      <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {TAGS.map((tag) => (
            <a
              key={tag}
              href={tag === "All" ? "/blog" : `/blog?tag=${tag}`}
              className={`px-5 py-2 text-xs font-sans tracking-widest uppercase border transition-all ${
                activeTag === tag
                  ? "border-brand-gold bg-brand-gold text-brand-charcoal font-semibold"
                  : "border-brand-charcoal/10 hover:border-brand-gold text-brand-charcoal"
              }`}
            >
              {tag}
            </a>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group border border-brand-charcoal/10 hover:border-brand-gold bg-[#1A1A18] text-brand-ivory transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              {/* Cover Image */}
              <div className="aspect-video overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                <div className="absolute top-4 left-4 bg-brand-gold text-brand-charcoal px-3 py-0.5 text-[9px] uppercase tracking-widest font-semibold">
                  {post.tag}
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[10px] text-brand-grey font-sans uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-brand-gold" />
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-brand-gold" />
                      Stone Curator
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-brand-ivory group-hover:text-brand-gold transition-colors font-medium">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-grey font-sans leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-brand-gold pt-2 group-hover:gap-2.5 transition-all w-fit"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
