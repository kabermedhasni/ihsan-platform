import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    const { data: needs, error } = await supabase
        .from('needs')
        .select('*')
        .eq('status', 'active');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const processedNeeds = needs.map(need => {
        const totalDonated = Number(need.total_donated || 0);

        return {
            ...need,
            fundedAmount: totalDonated,
            donorsCount: Number(need.donors_count || 0),
            targetAmount: Number(need.amount_required),
            fundingPercentage: Number(need.funding_percentage || 0)
        };
    });

    return NextResponse.json(processedNeeds);
}
