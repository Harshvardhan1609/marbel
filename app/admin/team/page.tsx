import { createClient } from "@/lib/supabase/server";
import TeamAdminClient from "@/components/admin/TeamAdminClient";

export const dynamic = "force-dynamic";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string | null;
  image_url?: string | null;
  order_index: number;
  is_published: boolean;
}

export default async function AdminTeamPage() {
  let team: TeamMember[] = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, title, bio, image_url, order_index, is_published")
      .order("order_index", { ascending: true });

    if (error) throw error;
    if (data) {
      team = data;
    }
  } catch (err) {
    console.error("Failed to query team members in admin:", err);
  }

  return <TeamAdminClient initialTeam={team} />;
}
