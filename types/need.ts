export interface Need {
    id: string;
    title: string;
    city: string;
    district: string;
    category: string;
    validator: string;
    amount_required: number;
    total_donated: number;
    funding_percentage: number;
    donors_count: number;
    expires_at: string;
    status: 'active' | 'completed' | 'urgent';
    lat: number;
    lng: number;
    description: string;
    beneficiaries: number;
}
