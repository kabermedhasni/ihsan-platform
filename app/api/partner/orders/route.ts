import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("needs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // For the hackathon/demo, we'll show needs that are either explicitly assigned
    // to this partner, OR have no partner assigned yet.
    // We also only want needs that have reached 100% funding.
    const relevantNeeds = data.filter((need) => {
      const isAssignedToMe = need.partner_id === user.id;
      const isUnassigned = need.partner_id === null;
      const isFullyFunded =
        Number(need.total_donated || 0) >= Number(need.amount_required) ||
        need.status === "completed";

      return (isAssignedToMe || isUnassigned) && isFullyFunded;
    });

    // Process data for the dashboard
    const processedOrders = relevantNeeds.map((order) => ({
      id: order.id.slice(0, 8).toUpperCase(),
      realId: order.id,
      city: (order as any).city || "Nouakchott",
      district: order.district,
      type: order.title,
      count: 1, // Defaulting to 1 for now
      amount: order.amount_required,
      status: mapDbStatusToUi(order.partner_status || "funded"),
      validatorName: "Internal Validator",
      beneficiaries: (order as any).beneficiaries || 1,
      notes: order.description,
      deliveryWindow: "18:00 - 19:00", // Placeholder
      createdAt: order.created_at,
    }));

    return NextResponse.json(processedOrders);
  } catch (err: any) {
    console.error("Partner orders API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function mapDbStatusToUi(status: string) {
  const map: Record<string, string> = {
    funded: "Funded",
    preparing: "Preparing",
    ready: "Ready",
    delivered: "Delivered",
  };
  return map[status?.toLowerCase()] || "Funded";
}
