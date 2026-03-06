import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    try {
        // 1. Total Donations & Cities Covered from needs table
        const { data: needs, error: needError } = await supabase
            .from('needs')
            .select('total_donated, district');

        if (needError) throw needError;

        const totalDonated = needs?.reduce((sum, n) => sum + Number(n.total_donated || 0), 0) || 0;
        const uniqueDistricts = new Set(needs?.map(n => n.district).filter(Boolean)).size;

        // 2. Verified Operations (Confirmations)
        const { count: verifiedCount, error: confirmationError } = await supabase
            .from('confirmations')
            .select('*', { count: 'exact', head: true });

        if (confirmationError) throw confirmationError;

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
