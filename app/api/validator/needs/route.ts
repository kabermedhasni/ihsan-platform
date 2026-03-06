import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from("needs")
            .select(`
                *,
                validator_id
            `)
            .eq("validator_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Process needs to calculate funded amount
        const processedNeeds = data.map(need => {
            return {
                id: need.id,
                title: need.title,
                city: need.city,
                district: need.district,
                category: need.category,
                targetAmount: Number(need.amount_required),
                fundedAmount: Number(need.total_donated || 0),
                beneficiaries: need.beneficiaries,
                status: mapDbStatusToUi(need.status),
                createdAt: need.created_at,
                description: need.description,
                partner: need.partner_id ? "Assigned Partner" : "Pending Assignment" // Temporary
            };
        });

        return NextResponse.json(processedNeeds);
    } catch (err: any) {
        console.error("Validator needs error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

function mapDbStatusToUi(status: string) {
    const s = status?.toLowerCase();
    if (s === 'active') return 'open';
    if (s === 'completed') return 'fullyFunded';
    if (s === 'delivered') return 'delivered';
    return 'open';
}
