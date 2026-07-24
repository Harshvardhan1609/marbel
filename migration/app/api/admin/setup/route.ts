import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "admin@sudhirmarbels.com";
const ADMIN_PASSWORD = "SudhirAdmin@2024";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== "sudhir-setup-2024") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const admin = createAdminClient();

    // Try to create the user directly via Admin API
    const { data, error } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });

    if (error) {
      // Stringify properly — AuthError may not have .message but has .status
      const errDetails = {
        message: error.message,
        status: error.status,
        name: error.name,
        full: JSON.stringify(error),
      };
      
      // Check if user already exists
      const alreadyExists = error.message?.toLowerCase().includes("already") ||
        error.status === 422 ||
        error.status === 409;

      if (alreadyExists) {
        return NextResponse.json({
          success: true,
          message: "Admin user already exists — credentials are valid",
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });
      }

      return NextResponse.json({ error: errDetails }, { status: 500 });
    }

    const userId = data.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "No user ID returned" }, { status: 500 });
    }

    // Upsert into public.admin_users
    await admin.from("admin_users").upsert({ id: userId, email: ADMIN_EMAIL }, { onConflict: "email" });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      userId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("Admin setup uncaught error:", err);
    return NextResponse.json({ error: msg, raw: String(err) }, { status: 500 });
  }
}
