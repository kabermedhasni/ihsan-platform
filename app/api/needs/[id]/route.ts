import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    try {
        // 1. Fetch the need details
        const { data: need, error: needError } = await supabase
            .from('needs')
            .select(`
                *,
                validator_id
            `)
            .eq('id', id)
            .single();

        if (needError) {
            console.error("Fetch need error:", needError);
            return NextResponse.json({ error: "Need not found" }, { status: 404 });
        }

        // 2. Format the response using aggregated columns
        const processedNeed = {
            ...need,
            fundedAmount: Number(need.total_donated || 0),
            donorsCount: Number(need.donors_count || 0),
            targetAmount: Number(need.amount_required),
            validatorName: "Official Validator",
            fundingPercentage: Number(need.funding_percentage || 0)
        };

        // Remove unused fields
        delete processedNeed.validator;
        delete processedNeed.transactions;

        return NextResponse.json(processedNeed);
    } catch (err: any) {
        console.error("API Single Need error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
