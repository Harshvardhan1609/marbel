import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Clock, User, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

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
    body_markdown: `## Understanding the Craft of Bookmatching
    
Bookmatching is the practice of matching two or more stone slabs, so that the adjoining surfaces mirror each other, giving the impression of an open book.
    
This technique is particularly popular with heavily veined marble types like Calacatta, Arabescato, or Statuario. When installed, the veins align to form symmetrical shapes.
    
- Sourcing the right block: Only highly veined blocks are suitable.
- Slicing sequentially: Slabs must be sliced back-to-back.
- Layout dry-runs: Slabs are laid out in the yard before installation to map out alignments.
    
## Aesthetic Impact in Architecture
    
In modern homes, bookmatched marble acts as a focal art piece. It is commonly implemented for penthouse lobby walls, luxury fireplace surrounds, and floating bathroom vanity structures.`,
    cover_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    tag: "Marble",
    created_at: "2024-06-15T12:00:00Z",
  },
  {
    id: "post-2",
    title: "Quartzite vs. Granite: Sourcing for Kitchen Islands",
    slug: "quartzite-vs-granite",
    excerpt: "Comparing density, porosity, and design options between quartzite and granite slabs for luxury kitchen countertops.",
    body_markdown: `## Choosing the Ultimate Kitchen Countertop
    
Kitchen islands are high-traffic zones requiring materials that resist acids, heat, and structural scratching.
    
Granite has been the industry standard for durability. However, exotic Quartzites (like Emerald Quartzite or Taj Mahal) have surged in popularity due to their marble-like aesthetics combined with superior density.
    
## Durability Comparison
    
Let us review how they hold up under daily use:
    
- Granite: Extremely dense, highly resistant to staining, requires periodic sealing.
- Quartzite: Harder than granite, has crystalline veins, and is virtually non-porous.
    
## Sourcing Recommendation
    
For bespoke contemporary projects, we recommend leathered quartzite slabs. They offer a unique tactile texture while hiding fingerprints and daily scuffs.`,
    cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    tag: "Quartzite",
    created_at: "2024-07-02T10:30:00Z",
  },
];

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = params;
  let title = "Stone Journal Article";
  let description = "Read design guides and curation stories from our stone curators.";
  let imageUrl = "";

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, cover_image")
      .eq("slug", slug)
      .single();
    if (data) {
      title = data.title;
      description = data.excerpt || `Read our latest article: ${data.title}.`;
      imageUrl = data.cover_image || "";
    }
  } catch {
    const mock = MOCK_POSTS.find((p) => p.slug === slug);
    if (mock) {
      title = mock.title;
      description = mock.excerpt;
      imageUrl = mock.cover_image;
    }
  }

  return {
    title: `${title} | Sudhir Marbels Journal`,
    description,
    openGraph: {
      title: `${title} | Sudhir Marbels`,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = params;
  
  let post: BlogPost | null = null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, body_markdown, cover_image, created_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) throw error;
    if (data) {
      post = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        body_markdown: data.body_markdown,
        cover_image: data.cover_image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
        tag: data.title.toLowerCase().includes("quartzite") ? "Quartzite" : "Marble",
        created_at: data.created_at,
      };
    }
  } catch (err) {
    console.error("Failed to query blog slug, using mock fallbacks:", err);
    post = MOCK_POSTS.find((p) => p.slug === slug) || null;
  }

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.cover_image],
    "datePublished": post.created_at,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": "Sudhir Marbels Curator"
    }
  };

  // Custom client-side markdown blocks parser
  const renderMarkdown = (text: string) => {
    return text.split("\n\n").map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-3xl font-serif text-brand-charcoal mt-8 mb-4 tracking-wide font-medium">
            {trimmed.replace("# ", "")}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-serif text-brand-charcoal mt-8 mb-4 tracking-wide font-medium">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").map((li) => li.replace("- ", "").trim());
        return (
          <ul key={idx} className="list-disc pl-6 space-y-2.5 my-6 font-sans text-brand-grey text-sm md:text-base leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="text-sm md:text-base text-brand-grey font-sans leading-relaxed my-4 font-light">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-brand-ivory text-brand-charcoal min-h-screen pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-grey hover:text-brand-gold transition-colors font-sans mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Link>

        {/* Editorial Title Block */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 text-[10px] text-brand-grey font-sans uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-brand-gold" />
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-brand-gold" />
              Stone Curator
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-brand-charcoal leading-tight">
            {post.title}
          </h1>
          <p className="text-sm text-brand-grey italic font-sans border-l border-brand-gold/30 pl-4 py-1 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Cover Image */}
        <div className="aspect-video w-full overflow-hidden border border-brand-gold/15 mb-12 bg-brand-charcoal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Long-form Article Content */}
        <article className="prose prose-stone max-w-none">
          {renderMarkdown(post.body_markdown)}
        </article>
      </div>
    </div>
    </>
  );
}
