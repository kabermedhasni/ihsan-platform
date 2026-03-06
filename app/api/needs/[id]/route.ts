import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    try {
        // 1. Fetch the need details along with validator info
        const { data: need, error: needError } = await supabase
            .from('needs')
            .select(`
                *,
                validator:profiles!validator_id (
                    display_name
                ),
                donations (
                    amount,
                    status
                )
            `)
            .eq('id', id)
            .single();

        if (needError) {
            console.error("Fetch need error:", needError);
            return NextResponse.json({ error: "Need not found" }, { status: 404 });
        }

        // 2. Calculate funding stats
        const totalDonated = need.donations
            ?.filter((d: any) => d.status === 'completed')
            .reduce((sum: number, d: any) => sum + Number(d.amount), 0) || 0;

        const donorsCount = new Set(
            need.donations
                ?.filter((d: any) => d.status === 'completed')
                .map((d: any) => d.donor_id)
        ).size;

        const processedNeed = {
            ...need,
            fundedAmount: totalDonated,
            donorsCount: donorsCount,
            targetAmount: Number(need.amount_required),
            validatorName: need.validator?.display_name || "Official Validator",
            fundingPercentage: Math.min(Math.round((totalDonated / Number(need.amount_required)) * 100), 100)
        };

        // Remove the raw donations from the response to keep it clean
        delete processedNeed.donations;
        delete processedNeed.validator;

        return NextResponse.json(processedNeed);
    } catch (err: any) {
        console.error("API Single Need error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
