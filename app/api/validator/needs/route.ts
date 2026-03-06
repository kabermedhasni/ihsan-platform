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
                donations (
                    amount,
                    status
                )
            `)
            .eq("validator_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Process needs to calculate funded amount
        const processedNeeds = data.map(need => {
            const totalDonated = need.donations
                ?.filter((d: any) => d.status === 'completed')
                .reduce((sum: number, d: any) => sum + Number(d.amount), 0) || 0;

            return {
                id: need.id,
                title: need.title,
                city: need.city,
                district: need.district,
                category: need.category,
                targetAmount: need.amount_required,
                fundedAmount: totalDonated,
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
    if (s === 'funded') return 'fullyFunded';
    if (s === 'partially_funded') return 'partiallyFunded'; // Guessing
    if (s === 'delivered') return 'delivered'; // For history
    return 'open';
}
