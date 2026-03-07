import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: needs, error } = await supabase.from("needs").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. Fetch all donations that are completed or pending to calculate real-time funding
  const { data: allDonations } = await supabase
    .from("donations")
    .select("need_id, amount")
    .eq("status", "completed");

  // 4. Create a map of funded amounts by need_id
  const fundingMap: Record<string, number> = {};
  const donorsMap: Record<string, number> = {};

  (allDonations || []).forEach((d) => {
    fundingMap[d.need_id] = (fundingMap[d.need_id] || 0) + Number(d.amount);
    donorsMap[d.need_id] = (donorsMap[d.need_id] || 0) + 1;
  });

  const processedNeeds = needs.map((need) => {
    const realFunded = fundingMap[need.id] || 0;
    const realDonors = donorsMap[need.id] || 0;
    const target = Number(need.amount_required);
    const pct =
      target > 0 ? Math.min(Math.round((realFunded / target) * 100), 100) : 0;

    return {
      ...need,
      // Overwrite database trigger values with real-time sums (completed + pending)
      total_donated: realFunded,
      donors_count: realDonors,
      funding_percentage: pct,
      // Aliases for components that use different names
      fundedAmount: realFunded,
      donorsCount: realDonors,
      targetAmount: target,
      fundingPercentage: pct,
    };
  });

  return NextResponse.json(processedNeeds);
}
