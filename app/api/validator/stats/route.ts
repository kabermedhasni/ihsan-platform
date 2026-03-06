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
        // Fetch stats for this validator
        const { data: needs, error } = await supabase
            .from("needs")
            .select(`
                id,
                status,
                beneficiaries,
                total_donated,
                amount_required
            `)
            .eq("validator_id", user.id);

        if (error) throw error;

        let needsCreated = needs.length;
        let needsFunded = 0;
        let deliveriesConfirmed = 0;
        let totalBeneficiaries = 0;

        needs.forEach(need => {
            const fundedAmount = Number(need.total_donated || 0);
            const targetAmount = Number(need.amount_required || 0);

            if (fundedAmount >= targetAmount && targetAmount > 0) {
                needsFunded++;
            }
            if (need.status === 'completed') {
                deliveriesConfirmed++;
            }
            totalBeneficiaries += (need.beneficiaries || 0);
        });

        return NextResponse.json({
            needsCreated,
            needsFunded,
            deliveriesConfirmed,
            totalBeneficiaries
        });
    } catch (err: any) {
        console.error("Validator stats error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
