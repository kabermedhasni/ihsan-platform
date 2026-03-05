import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    const { data: needs, error } = await supabase
        .from('needs')
        .select(`
      *,
      donations (
        amount,
        status
      )
    `)
        .eq('status', 'active');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const processedNeeds = needs.map(need => {
        const totalDonated = need.donations
            ?.filter((d: any) => d.status === 'completed')
            .reduce((sum: number, d: any) => sum + Number(d.amount), 0) || 0;

        return {
            ...need,
            total_donated: totalDonated,
            funding_percentage: Math.min(Math.round((totalDonated / Number(need.amount_required)) * 100), 100)
        };
    });

    return NextResponse.json(processedNeeds);
}
