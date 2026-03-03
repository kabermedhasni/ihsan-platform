import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Fetch role from profiles table to ensure it's up to date
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || user.user_metadata?.role;

  if (!role) {
    // If no role is found, maybe they haven't finished setup or something is wrong
    // For now, let's redirect to auth or a default page
    redirect("/auth");
  }

  // Redirect to the role-specific page
  redirect(`/${role.toLowerCase()}`);
}
