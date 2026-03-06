import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ValidatorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Fetch role from profiles table for reliable verification
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role: string = profile?.role || user.user_metadata?.role;

  // Protect path: if not validator, redirect to their role-specific page
  if (role?.toLowerCase() !== "validator") {
    redirect(role ? `/${role.toLowerCase()}` : "/auth");
  }

  const displayName =
    user.user_metadata?.display_name || user.email?.split("@")[0] || "User";

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 px-4 pt-32">
      <div className="text-center space-y-3">
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          Validator Dashboard
        </p>
        <h1 className="text-5xl font-bold text-foreground">
          {displayName} ch7alk
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          4e 3gabou tab3 lkm 2ntoume{" "}
          <span className="text-primary font-semibold">
            4e role 2li mssejel bih w 4ak 2nou3: Validator
          </span>
          .
        </p>
      </div>
    </div>
  );
}
