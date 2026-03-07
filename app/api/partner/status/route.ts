import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "partner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, status } = await request.json();

    console.log(
      `[API] Partner updating need ${id} partner_status -> ${status}`,
    );

    // Direct update to the needs table
    const { data, error } = await supabase
      .from("needs")
      .update({ partner_status: status.toLowerCase() })
      .eq("id", id)
      .select();

    if (error) {
      console.error("[API] partner/status update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.warn(
        "[API] Update completed but 0 rows returned, likely blocked by RLS.",
      );
      return NextResponse.json(
        { error: "Access denied by RLS policy. Cannot update partner_status." },
        { status: 403 },
      );
    }

    console.log(`[API] partner_status updated successfully`);
    return NextResponse.json({ success: true, updated: data });
  } catch (err: any) {
    console.error("Partner status update API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
