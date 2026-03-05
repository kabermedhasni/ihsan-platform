import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('donations')
            .select(`
          id,
          amount,
          created_at,
          status,
          hash,
          needs (
            title,
            district
          )
        `)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("API donation error:", err);
        return NextResponse.json({ error: "Failed to fetch donations" }, { status: 503 });
    }
}
