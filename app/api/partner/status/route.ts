import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, status } = await request.json();

        const { error } = await supabase
            .from('needs')
            .update({ status: status.toLowerCase() })
            .eq('id', id)
            .eq('partner_id', user.id); // Security check

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Partner status update API error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
