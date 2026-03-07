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
    console.error("[API] Auth error:", authError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("[API] Fetching donations for user:", user.id);

  // 2. Fetch this donor's donations
  const { data: donations, error } = await supabase
    .from("donations")
    .select(
      `
      id,
      amount,
      status,
      hash,
      created_at,
      need_id,
      donor_bank_number,
      validator_bank_number
    `,
    )
    .eq("donor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[API] Supabase error fetching donations:", error);
    // If the table is missing, return empty instead of 500 to keep UI clean
    if (
      error.code === "PGRST116" ||
      error.message?.includes("could not find the table")
    ) {
      return NextResponse.json({
        donations: [],
        stats: { totalDonated: 0, confirmedCount: 0, donationCount: 0 },
        warning: "Table 'donations' missing in schema. Please run migrations.",
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log("[API] Donations found:", donations?.length);

  const needIds = [
    ...new Set((donations ?? []).map((d: any) => d.need_id).filter(Boolean)),
  ];

  let needsMap: Record<string, any> = {};
  let fundedByNeed: Record<string, number> = {};

  if (needIds.length > 0) {
    const { data: needsData, error: needsError } = await supabase
      .from("needs")
      .select("*")
      .in("id", needIds);

    if (needsError) {
      console.error("Error fetching needs:", needsError);
      return NextResponse.json({ error: needsError.message }, { status: 500 });
    }

    (needsData ?? []).forEach((n) => {
      needsMap[n.id] = n;
    });

    const { data: allNeedDonations, error: allDonationsError } = await supabase
      .from("donations")
      .select("need_id, amount, status")
      .in("need_id", needIds);

    if (allDonationsError) {
      console.error("Error fetching allNeedDonations:", allDonationsError);
      return NextResponse.json(
        { error: allDonationsError.message },
        { status: 500 },
      );
    }

    (allNeedDonations ?? []).forEach((d: any) => {
      // Only include completed donations for officially recorded funding
      if (d.status === "completed") {
        fundedByNeed[d.need_id] =
          (fundedByNeed[d.need_id] ?? 0) + Number(d.amount);
      }
    });
  }

  // 4. Update the donations with the need data
  const resultDonations = (donations ?? []).map((d) => ({
    ...d,
    needs: needsMap[d.need_id] || null,
  }));

  const confirmationByNeed: Record<string, any> = {};

  if (needIds.length > 0) {
    const { data: confirmations, error: confirmationsError } = await supabase
      .from("confirmations")
      .select("*")
      .in("need_id", needIds);

    if (confirmationsError) {
      console.error("Error fetching confirmations:", confirmationsError);
      return NextResponse.json(
        { error: confirmationsError.message },
        { status: 500 },
      );
    }

    (confirmations ?? []).forEach((c: any) => {
      confirmationByNeed[c.need_id] = c;
    });
  }

  // 5. Build response
  const result = resultDonations.map((d: any) => {
    const need = d.needs;
    const needFunded = fundedByNeed[d.need_id] ?? 0;
    const needTarget = need ? Number(need.amount_required || 0) : 0;
    const confirmation = confirmationByNeed[d.need_id];

    return {
      id: d.id,
      needId: d.need_id,
      amount: Number(d.amount || 0),
      status: d.status || "pending",
      hash: d.hash ?? "",
      date: d.created_at,
      needTitle: need?.title ?? "Unknown Need",
      city: need?.city ?? "",
      district: need?.district ?? "",
      category: need?.category ?? "",
      needTarget,
      needFunded,
      fundingPercentage:
        needTarget > 0
          ? Math.min(Math.round((needFunded / needTarget) * 100), 100)
          : 0,
      proofImage: confirmation?.proof_image ?? null,
      validatorMessage: confirmation?.message ?? null,
      confirmedAt: confirmation?.created_at ?? null,
      donorBankNumber: d.donor_bank_number,
      validatorBankNumber: d.validator_bank_number,
    };
  });

  // 6. Compute donor stats
  const totalDonated = result
    .filter((d) => d.status === "completed")
    .reduce((s, d) => s + d.amount, 0);
  const confirmedCount = result.filter((d) => d.status === "completed").length;

  return NextResponse.json({
    donations: result,
    stats: { totalDonated, confirmedCount, donationCount: result.length },
  });
}
