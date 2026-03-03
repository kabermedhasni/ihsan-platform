import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/auth/actions";

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
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 font-sans">
      <div className="text-center space-y-3">
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          Validator Dashboard
        </p>
        <h1 className="text-5xl font-bold text-foreground">
          {displayName} ch7alk
        </h1>
        <p className="text-muted-foreground">
          4e 3gabou tab3 lkm 2ntoume{" "}
          <span className="text-primary font-semibold">
            4e role 2li mssejel bih w 4ak 2nou3: Validator
          </span>
          .
        </p>
      </div>

      <form action={logout}>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-all"
        >
          Sign Out
        </button>
      </form>
    </main>
  );
}
