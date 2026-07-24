import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Calendar, MapPin, Tag, ArrowLeft, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_urls: string[];
  location: string;
  completion_date: string;
  category: "residential" | "hospitality" | "commercial";
  stone_products_used: string[];
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "The Grandeur Penthouse",
    slug: "grandeur-penthouse",
    description: "A luxury private penthouse residence utilizing book-matched Italian marble slabs for wall cladding and premium flooring. Slabs were custom sliced in our Kishangarh facility to ensure precise bookmatching across the 4000 sqft main hall.",
    image_urls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
    ],
    location: "New Delhi, India",
    completion_date: "2024-05-12",
    category: "residential",
    stone_products_used: ["Calacatta Oro Marble", "Bianco Lasa Marble"],
  },
  {
    id: "proj-2",
    title: "Aman Plaza Lobby",
    slug: "aman-plaza-lobby",
    description: "Commercial reception lobby featuring custom back-lit emerald quartzite reception counter and book-matched onyx highlights. The translucent layers of onyx allow complete illumination, creating a dramatic luxury entry.",
    image_urls: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600",
    ],
    location: "Mumbai, India",
    completion_date: "2023-11-20",
    category: "hospitality",
    stone_products_used: ["Emerald Quartzite", "Arabescato Onyx"],
  },
  {
    id: "proj-3",
    title: "Oasis Executive Towers",
    slug: "oasis-executive-towers",
    description: "Luxury corporate office spaces finished with polished titanium gold granite panels and wall partitions. The dense granite provides a highly resilient, wear-resistant flooring solution for high-traffic executive corridors.",
    image_urls: [
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600",
    ],
    location: "Gurgaon, India",
    completion_date: "2023-08-15",
    category: "commercial",
    stone_products_used: ["Titanium Gold Granite"],
  },
  {
    id: "proj-4",
    title: "Heritage Courtyard Villa",
    slug: "heritage-courtyard-villa",
    description: "Classic residential villa incorporating warm Crema Marfil travertine tile surfaces for outdoor terraces and bathroom vanity tops. Hand-finished travertine tiles provide a non-slip, textured surface matching standard European architectural styles.",
    image_urls: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600",
    ],
    location: "Jaipur, India",
    completion_date: "2024-02-10",
    category: "residential",
    stone_products_used: ["Crema Marfil Travertine"],
  },
];

interface CaseStudyProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CaseStudyProps): Promise<Metadata> {
  const { slug } = params;
  let title = "Portfolio Case Study";
  let description = "Review our premium architectural custom stone designs.";
  let imageUrl = "";

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("title, description, image_urls")
      .eq("slug", slug)
      .single();
    if (data) {
      title = data.title;
      description = data.description || `Case study detailing our custom stone installation at ${data.title}.`;
      imageUrl = data.image_urls?.[0] || "";
    }
  } catch {
    const mock = MOCK_PROJECTS.find((p) => p.slug === slug);
    if (mock) {
      title = mock.title;
      description = mock.description;
      imageUrl = mock.image_urls[0];
    }
  }

  return {
    title: `${title} | Sudhir Marbels Portfolio`,
    description,
    openGraph: {
      title: `${title} | Sudhir Marbels`,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = params;
  
  let project: Project | null = null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, slug, description, image_urls, location, completion_date, category, stone_products_used")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) throw error;
    if (data) {
      project = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        image_urls: data.image_urls || [],
        location: data.location || "Unknown Location",
        completion_date: data.completion_date || "",
        category: (data.category || "residential") as "residential" | "hospitality" | "commercial",
        stone_products_used: data.stone_products_used || [],
      };
    }
  } catch (err) {
    console.error("Failed to query project slug, using mock fallbacks:", err);
    project = MOCK_PROJECTS.find((p) => p.slug === slug) || null;
  }

  if (!project) {
    notFound();
  }

  // Convert stone names to URLs
  const convertToSlug = (name: string) => name.toLowerCase().replace(/ /g, "-");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sudhirmarbels.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Projects",
        "item": "https://sudhirmarbels.com/projects"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.title,
        "item": `https://sudhirmarbels.com/projects/${project.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-brand-ivory text-brand-charcoal min-h-screen pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Back Link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-grey hover:text-brand-gold transition-colors font-sans mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Image showcase */}
          <div className="lg:col-span-8 space-y-4">
            <div className="aspect-[16/10] w-full overflow-hidden bg-brand-charcoal border border-brand-gold/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image_urls[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {project.image_urls.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {project.image_urls.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-[16/10] overflow-hidden bg-brand-charcoal border border-brand-gold/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Project detail image" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Case study specs */}
          <div className="lg:col-span-4 space-y-8 flex flex-col justify-start">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
                Portfolio Case Study
              </span>
              <h1 className="text-3xl font-serif tracking-tight text-brand-charcoal leading-tight">
                {project.title}
              </h1>
            </div>

            <div className="h-[1px] w-full bg-brand-gold/15" />

            {/* Specifications */}
            <ul className="space-y-4 font-sans text-xs">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-brand-gold shrink-0" />
                <div>
                  <span className="text-brand-grey block">Location</span>
                  <span className="font-semibold text-brand-charcoal">{project.location}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-brand-gold shrink-0" />
                <div>
                  <span className="text-brand-grey block">Completed Date</span>
                  <span className="font-semibold text-brand-charcoal">{project.completion_date}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-brand-gold shrink-0" />
                <div>
                  <span className="text-brand-grey block">Space Category</span>
                  <span className="font-semibold text-brand-charcoal uppercase tracking-widest">{project.category}</span>
                </div>
              </li>
            </ul>

            <div className="h-[1px] w-full bg-brand-gold/15" />

            {/* Stone Products Used */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-brand-grey font-sans font-semibold">
                Stones Utilized
              </h4>
              <div className="flex flex-col gap-2.5">
                {project.stone_products_used.map((stone) => (
                  <Link
                    key={stone}
                    href={`/collections/${convertToSlug(stone)}`}
                    className="flex items-center justify-between p-3.5 border border-brand-charcoal/10 hover:border-brand-gold bg-brand-charcoal/5 hover:bg-brand-charcoal hover:text-brand-ivory transition-all duration-300 group"
                  >
                    <span className="text-xs font-sans font-semibold">{stone}</span>
                    <ArrowUpRight className="h-4 w-4 text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed description below */}
        <div className="mt-16 max-w-4xl space-y-6">
          <h3 className="font-serif text-2xl text-brand-charcoal tracking-wide">
            Project Overview & Implementation
          </h3>
          <p className="text-sm text-brand-grey font-sans leading-relaxed font-light">
            {project.description}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
