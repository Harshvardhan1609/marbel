"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, Mail, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginFormValues>,
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      console.error("Auth sign-in failed:", error);
      setErrorMsg(error.message || "Invalid authentication credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-charcoal text-brand-ivory min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background visual texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#B08D3E04_1px,transparent_1px),linear-gradient(to_bottom,#B08D3E04_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-[#1F1F1D] border border-brand-gold/15 p-8 sm:p-12 shadow-2xl z-10 space-y-8">
        
        {/* Brand/Branding */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-semibold font-sans">
            Sudhir Marbels Curator
          </span>
          <h1 className="text-3xl font-serif tracking-wide text-brand-ivory">
            Admin Portal
          </h1>
          <p className="text-xs text-brand-grey font-sans">
            Please log in with your administrative credentials to manage inventory.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-500/20 text-red-400 text-xs text-center font-sans">
            {errorMsg}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4.5 w-4.5 text-brand-gold/70" />
              <input
                type="email"
                {...register("email")}
                className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold pl-11 pr-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                placeholder="admin@sudhirmarbels.com"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-red-400 block">{errors.email.message}</span>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-brand-grey font-semibold block">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4.5 w-4.5 text-brand-gold/70" />
              <input
                type="password"
                {...register("password")}
                className="w-full bg-brand-charcoal border border-brand-gold/20 focus:border-brand-gold pl-11 pr-4 py-3 text-xs text-brand-ivory focus:outline-none rounded-none placeholder-brand-grey/25"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <span className="text-[10px] text-red-400 block">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-gold hover:bg-brand-ivory text-brand-charcoal hover:text-brand-charcoal font-semibold font-sans text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-[10px] uppercase tracking-widest text-brand-grey hover:text-brand-gold transition-colors font-sans"
          >
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
