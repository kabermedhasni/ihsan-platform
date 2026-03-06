export interface Transaction {
    id: string;
    city: string;
    category: "food" | "medical" | "housing" | "other" | string;
    amount: number;
    status: "confirmed" | "delivered" | "funded" | string;
    timestamp: string;
    hash: string;
    validator: string;
    proofImage: string;
    beneficiaries: number;
}
