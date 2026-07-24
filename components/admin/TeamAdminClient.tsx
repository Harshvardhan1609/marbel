"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Plus, Search, Edit2, Trash2, X, Upload, Loader2, Users } from "lucide-react";

const teamFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  bio: z.string().optional().nullable(),
  image_url: z.string().min(1, "Please provide a portrait image URL"),
  order_index: z.coerce.number().default(0),
  is_published: z.boolean().default(true),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string | null;
  image_url?: string | null;
  order_index: number;
  is_published: boolean;
}

interface TeamAdminClientProps {
  initialTeam: TeamMember[];
}

export default function TeamAdminClient({ initialTeam }: TeamAdminClientProps) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema) as unknown as Resolver<TeamFormValues>,
    defaultValues: {
      order_index: 0,
      is_published: true,
      image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400",
    },
  });

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setUploadError(null);
    reset({
      id: member.id,
      name: member.name,
      title: member.title,
      bio: member.bio,
      image_url: member.image_url || "",
      order_index: member.order_index,
      is_published: member.is_published,
    });
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingMember(null);
    setUploadError(null);
    reset({
      name: "",
      title: "",
      bio: "",
      image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400",
      order_index: team.length + 1,
      is_published: true,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
      setTeam((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete team member: " + (err as Error).message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `team/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("catalogue")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("catalogue").getPublicUrl(filePath);
      setValue("image_url", data.publicUrl);
    } catch (err) {
      console.error(err);
      setUploadError((err as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values: TeamFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        title: values.title,
        bio: values.bio || "",
        image_url: values.image_url,
        order_index: values.order_index,
        is_published: values.is_published,
      };

      if (values.id) {
        // Update
        const { data, error } = await supabase
          .from("team_members")
          .update(payload)
          .eq("id", values.id)
          .select()
          .single();

        if (error) throw error;

        setTeam((prev) =>
          prev.map((t) => (t.id === values.id ? (data as TeamMember) : t))
        );
      } else {
        // Insert
        const { data, error } = await supabase
          .from("team_members")
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setTeam((prev) => [...prev, data as TeamMember]);
      }

      setIsFormOpen(false);
      reset();
    } catch (err) {
      alert("Failed to save team member: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTeam = team.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif text-brand-ivory tracking-wide flex items-center gap-2">
            <Users className="h-7 w-7 text-brand-gold" />
            <span>Team & Leadership Editor</span>
          </h1>
          <p className="text-xs text-brand-grey font-sans">
            Add team profiles, curation advisors, and operational board details.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-ivory hover:text-brand-charcoal transition-colors duration-300 font-sans text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 rounded-none"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Profile</span>
        </button>
      </div>

      <div className="h-[1px] w-full bg-brand-gold/15" />

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A18] border border-brand-gold/10 focus:border-brand-gold pl-11 pr-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/40"
            placeholder="Search profiles..."
          />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-brand-grey font-sans">
          Total Profiles: <span className="text-brand-gold font-bold">{team.length}</span>
        </div>
      </div>

      {/* List of members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredTeam.map((member) => (
          <div
            key={member.id}
            className="bg-[#1A1A18] border border-brand-gold/10 p-6 flex gap-6 relative shadow-lg group hover:border-brand-gold/30 transition-all duration-300"
          >
            {/* Portrait Thumbnail */}
            <div className="w-24 h-32 bg-brand-charcoal border border-brand-gold/10 shrink-0 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"}
                alt={member.name}
                className="w-full h-full object-cover grayscale opacity-90"
              />
              {!member.is_published && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-[8px] uppercase tracking-widest text-red-400 border border-red-500/30 px-1.5 py-0.5 font-bold font-sans bg-brand-charcoal/80">
                    Draft
                  </span>
                </div>
              )}
            </div>

            {/* Content Info */}
            <div className="flex-grow space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-widest text-brand-gold font-semibold font-sans block">
                  Rank order: {member.order_index}
                </span>
                <h3 className="font-serif text-xl text-brand-ivory leading-tight font-medium tracking-wide">
                  {member.name}
                </h3>
                <span className="text-[10px] uppercase font-sans text-brand-grey tracking-wide font-medium block">
                  {member.title}
                </span>
                <p className="text-[11px] text-brand-grey font-sans line-clamp-2 leading-relaxed">
                  {member.bio || "No biography details added yet."}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-2 border-t border-brand-gold/10 justify-end">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex items-center gap-1 text-[10px] uppercase font-sans tracking-widest text-brand-grey hover:text-brand-gold transition-colors"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex items-center gap-1 text-[10px] uppercase font-sans tracking-widest text-brand-grey hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-out modal form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-brand-charcoal h-full border-l border-brand-gold/10 p-8 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-brand-gold/15">
                <h3 className="font-serif text-2xl text-brand-ivory tracking-wide">
                  {editingMember ? "Edit Team Profile" : "Create Team Profile"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-brand-grey hover:text-brand-gold transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Member Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                    placeholder="E.g., Arihant Jain"
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-400 block">{errors.name.message}</span>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                    placeholder="E.g., Principal Stone Curator"
                  />
                  {errors.title && (
                    <span className="text-[10px] text-red-400 block">{errors.title.message}</span>
                  )}
                </div>

                {/* Bio text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Short Biography
                  </label>
                  <textarea
                    rows={4}
                    {...register("bio")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25 resize-none"
                    placeholder="Describe their expertise, global quarry selection skills, or design advising qualifications..."
                  />
                </div>

                {/* Portrait Portrait URL */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Portrait Image URL
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      {...register("image_url")}
                      className="flex-grow bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <label className="px-4 py-2.5 bg-brand-charcoal border border-brand-gold/20 hover:border-brand-gold hover:text-brand-gold cursor-pointer transition-colors text-brand-grey font-sans text-xs flex items-center gap-1 shrink-0">
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin text-brand-gold" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {uploadError && (
                    <span className="text-[10px] text-red-400 block mt-1 font-sans">
                      ⚠️ Upload Error: {uploadError}. (Run SQL migrations to setup storage buckets).
                    </span>
                  )}
                  {errors.image_url && (
                    <span className="text-[10px] text-red-400 block">{errors.image_url.message}</span>
                  )}
                </div>

                {/* Rank sorting index */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-brand-grey block font-sans">
                    Sort Index / Rank Order
                  </label>
                  <input
                    type="number"
                    {...register("order_index")}
                    className="w-full bg-[#1A1A18] border border-brand-gold/20 focus:border-brand-gold px-4 py-2.5 text-xs text-brand-ivory focus:outline-none rounded-none"
                  />
                </div>

                {/* Published toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    {...register("is_published")}
                    className="h-4.5 w-4.5 accent-brand-gold bg-[#1A1A18] border-brand-gold/20 focus:ring-0 cursor-pointer rounded-none"
                  />
                  <label htmlFor="is_published" className="text-xs text-brand-ivory font-sans cursor-pointer select-none">
                    Publish this profile publicly (visible on public /team page)
                  </label>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 py-4 bg-brand-gold text-brand-charcoal font-bold font-sans text-xs tracking-widest uppercase hover:bg-brand-ivory transition-colors flex items-center justify-center gap-2 rounded-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save Advisor Profile</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
