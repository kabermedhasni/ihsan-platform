import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Check if user is a validator
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "validator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Fetch pending donations
  const { data: donations, error } = await supabase
    .from("donations")
    .select(
      `
      id,
      amount,
      status,
      hash,
      created_at,
      donor_bank_number,
      validator_bank_number,
      donor_id,
      proof_image_url,
      needs (
        id,
        title
      )
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[API] Error fetching pending payments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4. Map to the expected Transaction type
  const transactions = (donations || []).map((d: any) => ({
    id: d.id,
    amount: Number(d.amount),
    status: "PENDING_VALIDATION", // Map pending to the UI's expected status
    hash: d.hash || "0x...",
    timestamp: d.created_at,
    donorBankNumber: d.donor_bank_number || "Unknown",
    validatorBankNumber: d.validator_bank_number || "BANK-IHSAN-2026",
    proofImageUrl: d.proof_image_url,
    needTitle: d.needs?.title || "Donation",
    needId: d.needs?.id,
  }));

  return NextResponse.json(transactions);
}
