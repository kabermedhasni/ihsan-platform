import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Role check (Optional but recommended)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || user.user_metadata?.role;
  if (role?.toLowerCase() !== "validator" && role?.toLowerCase() !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only validators can create needs" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      amount_required,
      city,
      district,
      category,
      beneficiaries,
      partner_id,
      lat,
      lng,
    } = body;

    // 3. Insert into needs table
    const { data, error } = await supabase
      .from("needs")
      .insert({
        title,
        description,
        amount_required,
        city,
        district,
        category,
        lat,
        lng,
        beneficiaries: Number(beneficiaries) || 1,
        status: "active",
        validator_id: user.id,
        partner_id: partner_id || null, // Can be assigned later or now
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Create need error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
