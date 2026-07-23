import { createClient } from "@/lib/supabase/server";
import ProjectsClient from "@/components/projects/ProjectsClient";

export const dynamic = "force-dynamic";

const MOCK_PROJECTS = [
  {
    id: "proj-1",
    title: "The Grandeur Penthouse",
    slug: "grandeur-penthouse",
    description: "A luxury private penthouse residence utilizing book-matched Italian marble slabs for wall cladding and premium flooring.",
    image_urls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"],
    location: "New Delhi, India",
    completion_date: "2024-05-12",
    category: "residential" as const,
  },
  {
    id: "proj-2",
    title: "Aman Plaza Lobby",
    slug: "aman-plaza-lobby",
    description: "Commercial reception lobby featuring custom back-lit emerald quartzite reception counter and book-matched onyx highlights.",
    image_urls: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"],
    location: "Mumbai, India",
    completion_date: "2023-11-20",
    category: "hospitality" as const,
  },
  {
    id: "proj-3",
    title: "Oasis Executive Towers",
    slug: "oasis-executive-towers",
    description: "Luxury corporate office spaces finished with polished titanium gold granite panels and wall partitions.",
    image_urls: ["https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600"],
    location: "Gurgaon, India",
    completion_date: "2023-08-15",
    category: "commercial" as const,
  },
  {
    id: "proj-4",
    title: "Heritage Courtyard Villa",
    slug: "heritage-courtyard-villa",
    description: "Classic residential villa incorporating warm Crema Marfil travertine tile surfaces for outdoor terraces and bathroom vanity tops.",
    image_urls: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600"],
    location: "Jaipur, India",
    completion_date: "2024-02-10",
    category: "residential" as const,
  },
];

export default async function ProjectsPage() {
  let projects = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, slug, description, image_urls, location, completion_date, category")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      projects = data.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description || "",
        image_urls: p.image_urls || [],
        location: p.location || "Unknown Location",
        completion_date: p.completion_date || "",
        category: (p.category || "residential") as "residential" | "hospitality" | "commercial",
      }));
    } else {
      projects = MOCK_PROJECTS;
    }
  } catch (err) {
    console.error("Failed to query projects from Supabase, using mock portfolio data:", err);
    projects = MOCK_PROJECTS;
  }

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Page Header */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Stone Showcase
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
            Architectural Portfolios
          </h1>
          <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
            Review our bespoke structural projects. From private estates in Delhi to hospitality venues in Mumbai, see how our stone slabs redefine space.
          </p>
        </div>
      </div>

      {/* Main client-side tab grid */}
      <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <ProjectsClient initialProjects={projects} />
      </div>
    </div>
  );
}
