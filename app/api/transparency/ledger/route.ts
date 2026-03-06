import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch needs that are either funded or delivered
        const { data: needs, error: needsError } = await supabase
            .from("needs")
            .select(`
                id,
                city,
                category,
                amount_required,
                status,
                created_at,
                beneficiaries,
                validator_id
            `)
            .in("status", ["active", "completed", "urgent"])
            .order("created_at", { ascending: false });

        if (needsError) {
            console.error("Needs fetch error:", needsError);
            return NextResponse.json({ error: needsError.message }, { status: 500 });
        }

        if (!needs || needs.length === 0) {
            return NextResponse.json([]);
        }

        // Fetch confirmations for these needs
        const needIds = needs.map(n => n.id);
        const { data: confirmations, error: confirmationsError } = await supabase
            .from("confirmations")
            .select("need_id, proof_image, message, created_at")
            .in("need_id", needIds);

        if (confirmationsError) {
            console.error("Confirmations fetch error:", confirmationsError);
        }

        const confirmationsMap = (confirmations || []).reduce((acc: any, curr: any) => {
            acc[curr.need_id] = curr;
            return acc;
        }, {});

        // Transform data to match the UI Transaction interface
        const transactions = needs.map((need: any) => {
            const confirmation = confirmationsMap[need.id];

            // Generate a deterministic-looking hash based on ID and timestamp
            const hash = `0x${Buffer.from(`${need.id}-${need.created_at}`).toString('hex').slice(0, 48)}`;

            return {
                id: need.id,
                city: need.city,
                category: need.category,
                amount: need.amount_required,
                status: need.status,
                timestamp: new Date(need.created_at).toLocaleString(),
                hash: hash,
                validator: "Official Validator",
                proofImage: confirmation?.proof_image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
                beneficiaries: need.beneficiaries || 0
            };
        });

        return NextResponse.json(transactions);
    } catch (error: any) {
        console.error("Ledger API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
