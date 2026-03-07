import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

  // 3. Get payload
  const data = await request.json();
  const { id, status } = data; // id = donation id, status is 'CONFIRMED' or 'REJECTED'

  if (!id || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // 4. Fetch the donation first to get the need_id
  const { data: donation, error: fetchError } = await supabase
    .from("donations")
    .select("id, need_id, amount")
    .eq("id", id)
    .single();

  if (fetchError || !donation) {
    console.error("[API] Donation not found:", fetchError);
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }

  const donStatus = status === "CONFIRMED" ? "completed" : "failed";
  const needId = donation.need_id;

  // 5. Update the donation status
  const { error: donUpdateError } = await supabase
    .from("donations")
    .update({ status: donStatus })
    .eq("id", id);

  if (donUpdateError) {
    console.error("[API] Error updating donation:", donUpdateError);
    return NextResponse.json(
      { error: donUpdateError.message },
      { status: 500 },
    );
  }

  // 6. If CONFIRMED, aggregate all completed donations and update the needs table directly
  // (bypasses any DB trigger issues by doing the math explicitly in the API)
  if (status === "CONFIRMED" && needId) {
    // Sum all completed donations for this need
    const { data: allDonations } = await supabase
      .from("donations")
      .select("amount")
      .eq("need_id", needId)
      .eq("status", "completed");

    const totalDonated =
      allDonations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
    const donorsCount = allDonations?.length || 0;

    // Get the need to find amount_required
    const { data: needRecord } = await supabase
      .from("needs")
      .select("amount_required")
      .eq("id", needId)
      .single();

    if (needRecord) {
      const amountRequired = Number(needRecord.amount_required);
      const fundingPercentage =
        amountRequired > 0
          ? Math.min((totalDonated / amountRequired) * 100, 100)
          : 0;

      const needUpdatePayload: Record<string, any> = {
        total_donated: totalDonated,
        donors_count: donorsCount,
        funding_percentage: fundingPercentage,
      };

      // Mark as completed if fully funded
      if (totalDonated >= amountRequired) {
        needUpdatePayload.status = "completed";
      }

      const { error: needUpdateError } = await supabase
        .from("needs")
        .update(needUpdatePayload)
        .eq("id", needId);

      if (needUpdateError) {
        console.error(
          "[API] Error updating need funding stats:",
          needUpdateError,
        );
        // Don't return error — donation was approved, just log the sync failure
      } else {
        console.log(
          `[API] Need ${needId} funding synced: ${totalDonated}/${amountRequired} (${fundingPercentage.toFixed(1)}%)`,
        );
      }
    }
  }

  return NextResponse.json({
    success: true,
    newStatus: status === "CONFIRMED" ? "completed" : "failed",
  });
}
