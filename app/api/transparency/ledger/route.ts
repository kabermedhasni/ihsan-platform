import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch needs that are either funded or delivered
        // We join with confirmations to get proof details
        const { data: needs, error } = await supabase
            .from("needs")
            .select(`
        id,
        city,
        category,
        target_amount,
        status,
        created_at,
        validator:profiles!needs_validator_id_fkey(full_name),
        confirmations (
          image_url,
          message,
          created_at
        )
      `)
            .in("status", ["funded", "delivered", "confirmed"])
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Transform data to match the UI Transaction interface
        const transactions = needs.map((need: any) => {
            const confirmation = need.confirmations?.[0];

            // Generate a deterministic-looking hash based on ID and timestamp for the "simulated blockchain" feel
            // In a real app, this might be a real hash from a blockchain table
            const hash = `0x${Buffer.from(`${need.id}-${need.created_at}`).toString('hex').slice(0, 48)}`;

            return {
                id: need.id,
                city: need.city,
                category: need.category,
                amount: need.target_amount,
                status: need.status,
                timestamp: new Date(need.created_at).toLocaleString(),
                hash: hash,
                validator: need.validator?.full_name || "Anonymous Validator",
                proofImage: confirmation?.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
                beneficiaries: 0 // We'd need to add this column to the table or calculate it
            };
        });

        return NextResponse.json(transactions);
    } catch (error: any) {
        console.error("Ledger API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
