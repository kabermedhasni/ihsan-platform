import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('needs')
            .select(`
                id,
                title,
                description,
                amount_required,
                district,
                status,
                created_at,
                partner_id,
                validator_id
            `)
            .eq('partner_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Process data for the dashboard
        const processedOrders = data.map(order => ({
            id: order.id.slice(0, 8).toUpperCase(),
            realId: order.id,
            city: "Nouakchott", // Hardcoded as per current scope
            district: order.district,
            type: order.title,
            count: 1, // Defaulting to 1 for now
            amount: order.amount_required,
            scheduledTime: "18:30", // Placeholder
            status: mapDbStatusToUi(order.status),
            validatorName: "Internal Validator",
            beneficiaries: 1, // Placeholder
            notes: order.description,
            deliveryWindow: "18:00 - 19:00", // Placeholder
            createdAt: order.created_at
        }));

        return NextResponse.json(processedOrders);
    } catch (err: any) {
        console.error("Partner orders API error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

function mapDbStatusToUi(status: string) {
    const map: Record<string, string> = {
        'funded': 'Funded',
        'preparing': 'Preparing',
        'ready': 'Ready',
        'delivered': 'Delivered'
    };
    return map[status?.toLowerCase()] || 'Funded';
}
