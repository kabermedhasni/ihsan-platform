import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch this donor's donations with joined need data
    const { data: donations, error } = await supabase
        .from('donations')
        .select(`
            id,
            amount,
            status,
            hash,
            created_at,
            needs (
                id,
                title,
                city,
                district,
                category,
                amount_required,
                lat,
                lng
            )
        `)
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. For each donation's need, calculate total funded amount across all donations
    const needIds = [...new Set((donations ?? []).map((d: any) => d.needs?.id).filter(Boolean))];

    const { data: allNeedDonations } = await supabase
        .from('donations')
        .select('need_id, amount, status')
        .in('need_id', needIds);

    const fundedByNeed: Record<string, number> = {};
    (allNeedDonations ?? []).forEach((d: any) => {
        if (d.status === 'completed') {
            fundedByNeed[d.need_id] = (fundedByNeed[d.need_id] ?? 0) + Number(d.amount);
        }
    });

    // 4. Fetch confirmations for this user's donations
    const donationIds = (donations ?? []).map((d: any) => d.id);
    const { data: confirmations } = await supabase
        .from('confirmations')
        .select('donation_id, message, proof_image, created_at')
        .in('donation_id', donationIds);

    const confirmationByDonation: Record<string, { message: string; proof_image: string; created_at: string }> = {};
    (confirmations ?? []).forEach((c: any) => {
        confirmationByDonation[c.donation_id] = c;
    });

    // 5. Build response
    const result = (donations ?? []).map((d: any) => {
        const need = d.needs;
        const needFunded = need ? (fundedByNeed[need.id] ?? 0) : 0;
        const needTarget = need ? Number(need.amount_required) : 0;
        const confirmation = confirmationByDonation[d.id];

        return {
            id: d.id,
            amount: Number(d.amount),
            status: d.status,         // 'pending' | 'completed' | 'failed'
            hash: d.hash ?? '',
            date: d.created_at,
            needTitle: need?.title ?? 'Unknown Need',
            city: need?.city ?? '',
            district: need?.district ?? '',
            category: need?.category ?? '',
            needTarget,
            needFunded,
            fundingPercentage: needTarget > 0
                ? Math.min(Math.round((needFunded / needTarget) * 100), 100)
                : 0,
            proofImage: confirmation?.proof_image ?? null,
            validatorMessage: confirmation?.message ?? null,
            confirmedAt: confirmation?.created_at ?? null,
        };
    });

    // 6. Compute donor stats
    const totalDonated = result.filter(d => d.status === 'completed').reduce((s, d) => s + d.amount, 0);
    const confirmedCount = result.filter(d => d.status === 'completed').length;

    return NextResponse.json({ donations: result, stats: { totalDonated, confirmedCount, donationCount: result.length } });
}
