import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    // 1. Fetch the need details
    const { data: need, error: needError } = await supabase
      .from("needs")
      .select(
        `
                *,
                validator_id
            `,
      )
      .eq("id", id)
      .single();

    if (needError) {
      console.error("Fetch need error:", needError);
      return NextResponse.json({ error: "Need not found" }, { status: 404 });
    }

    // 2. Calculate real-time funding including pending
    const { data: donations } = await supabase
      .from("donations")
      .select("amount")
      .eq("need_id", id)
      .eq("status", "completed");

    const realTimeFunded = (donations || []).reduce(
      (acc, d) => acc + Number(d.amount),
      0,
    );
    const donorsCountReal = (donations || []).length;

    // 2. Format the response using aggregated columns
    const target = Number(need.amount_required);
    const pct =
      target > 0
        ? Math.min(Math.round((realTimeFunded / target) * 100), 100)
        : 0;

    const processedNeed = {
      ...need,
      // Field names for FundingProgress component
      fundedAmount: realTimeFunded,
      donorsCount: donorsCountReal,
      targetAmount: target,
      fundingPercentage: pct,
      // Field names for NeedCard (if reused) and general consistency
      total_donated: realTimeFunded,
      donors_count: donorsCountReal,
      amount_required: target,
      funding_percentage: pct,
      validatorName: "Official Validator",
    };

    // Remove unused fields
    delete processedNeed.validator;
    delete processedNeed.transactions;

    return NextResponse.json(processedNeed);
  } catch (err: any) {
    console.error("API Single Need error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
