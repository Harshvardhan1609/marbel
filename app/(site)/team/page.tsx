import { createClient } from "@/lib/supabase/server";
import { ScrollReveal, StaggerContainer } from "@/components/motion";
import { Award, Mail, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image_url: string;
}

const FALLBACK_TEAM: TeamMember[] = [
  {
    id: "t-1",
    name: "Arihant Jain",
    title: "Managing Director & Founder",
    bio: "Over 20 years of expertise in natural stone curation and global quarry acquisitions, bringing fine stone to Indian architecture.",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400",
  },
  {
    id: "t-2",
    name: "Rahul Jain",
    title: "Head of Global Sourcing",
    bio: "Spearheads quality inspections across Italy, Greece, and Brazil to select premium blocks matching international design standards.",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400",
  },
  {
    id: "t-3",
    name: "Amit Sharma",
    title: "Principal Stone Curator",
    bio: "Advises luxury architects and project builders on stone structural soundness, bookmatch layouts, and aesthetic detailing.",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
  },
];

export default async function TeamPage() {
  let team: TeamMember[] = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, title, bio, image_url")
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      team = data.map((t) => ({
        id: t.id,
        name: t.name,
        title: t.title,
        bio: t.bio || "",
        image_url: t.image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      }));
    } else {
      team = FALLBACK_TEAM;
    }
  } catch (e) {
    console.error("Failed to fetch team members:", e);
    team = FALLBACK_TEAM;
  }

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Header */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-semibold block">
            Our Advisors
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-brand-ivory">
            Leadership & Curators
          </h1>
          <p className="max-w-xl text-sm text-brand-grey font-sans leading-relaxed">
            Meet the visionaries, sourcing specialists, and design advisors guiding your project through raw block selection to bespoke installation.
          </p>
        </div>
      </div>

      {/* Leadership Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <ScrollReveal
              key={member.id}
              delay={idx * 0.15}
              className="bg-[#1A1A18] border border-brand-gold/10 hover:border-brand-gold/30 p-6 flex flex-col justify-between transition-all duration-300 group"
            >
              <div className="space-y-6">
                {/* Portrait */}
                <div className="aspect-[4/5] w-full overflow-hidden bg-brand-charcoal border border-brand-gold/10 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 p-2 bg-brand-charcoal/80 border border-brand-gold/20 text-brand-gold rounded-full">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-brand-ivory tracking-wide font-medium">
                    {member.name}
                  </h3>
                  <span className="text-xs uppercase tracking-widest text-brand-gold font-sans font-semibold block">
                    {member.title}
                  </span>
                  <p className="text-xs text-brand-grey font-sans leading-relaxed font-light pt-2">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Action/Contact info footer card */}
              <div className="border-t border-brand-gold/10 mt-6 pt-6 flex items-center justify-between text-brand-grey hover:text-brand-gold cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold font-sans">
                    Request Consultation
                  </span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}
