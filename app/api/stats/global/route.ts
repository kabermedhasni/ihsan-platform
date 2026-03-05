import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    try {
        // 1. Total Donations
        const { data: donations, error: donationError } = await supabase
            .from('donations')
            .select('amount')
            .eq('status', 'completed');

        if (donationError) throw donationError;

        const totalDonated = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

        // 2. Verified Operations (Confirmations)
        const { count: verifiedCount, error: confirmationError } = await supabase
            .from('confirmations')
            .select('*', { count: 'exact', head: true });

        if (confirmationError) throw confirmationError;

        // 3. Cities Covered
        const { data: needs, error: needError } = await supabase
            .from('needs')
            .select('district');

        if (needError) throw needError;

        const uniqueDistricts = new Set(needs?.map(n => n.district)).size;

        return NextResponse.json({
            totalDonated,
            verifiedCount: verifiedCount || 0,
            citiesCovered: uniqueDistricts || 0
        });
    } catch (err: any) {
        console.error("API stats error:", err);
        return NextResponse.json({ error: err.message || "Failed to fetch stats" }, { status: 503 });
    }
}
