export type DonationStatus = 'funding' | 'in-progress' | 'delivered';

export interface Donation {
    id: string;
    needTitle: string;
    city: string;
    district: string;
    category: string;
    amount: number;
    status: DonationStatus;
    date: string;
    hash: string;
    proofImage?: string;
    validatorMessage?: string;
    needTarget: number;
    needFunded: number;
}
