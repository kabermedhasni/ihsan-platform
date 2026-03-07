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

  try {
    const { need_id, message, proof_image } = await request.json();

    // 2. Create confirmation record
    const { error: confError } = await supabase.from("confirmations").insert({
      need_id,
      validator_id: user.id,
      message,
      proof_image,
      // donation_id is also in schema maybe? from Step 381: .in("donation_id", donationIds)
      // If it's a need-level confirmation, maybe we don't need donation_id or we link to all completed donations.
    });

    if (confError) throw confError;

    // 3. Update need status to 'delivered'
    const { error: needError } = await supabase
      .from("needs")
      .update({ status: "delivered" })
      .eq("id", need_id)
      .eq("validator_id", user.id);

    if (needError) throw needError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Confirmation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
