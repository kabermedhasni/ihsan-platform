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

export const mockDonations: Donation[] = [
    {
        id: "TXN-2024-001",
        needTitle: "5 Iftar Meals for Needy Families",
        city: "Nouakchott",
        district: "Arafat",
        category: "Meals",
        amount: 2350,
        status: "funding",
        date: "2024-03-01",
        hash: "a3f8c2d1e4b9f7a2c5d8e1f4b7c0d3a6",
        needTarget: 5000,
        needFunded: 2350,
    },
    {
        id: "TXN-2024-002",
        needTitle: "Diabetes Patient Treatment Support",
        city: "Nouadhibou",
        district: "El Kansado",
        category: "Medical",
        amount: 5000,
        status: "delivered",
        date: "2024-02-15",
        hash: "b7d4e9f2a5c8b1e4d7f0a3c6b9d2e5f8",
        proofImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
        validatorMessage: "Insulin medication was successfully delivered to the patient and his family.",
        needTarget: 15000,
        needFunded: 15000,
    },
    {
        id: "TXN-2024-003",
        needTitle: "Roof Repair for Storm-Damaged Home",
        city: "Rosso",
        district: "El Satara",
        category: "Housing",
        amount: 8000,
        status: "in-progress",
        date: "2024-02-28",
        hash: "c1e7f3a9d5b2e8f4c0d6a2b8e4f1c7d3",
        needTarget: 40000,
        needFunded: 12000,
    },
    {
        id: "TXN-2024-004",
        needTitle: "Food Basket for Orphan Family",
        city: "Nouakchott",
        district: "Toujounine",
        category: "Meals",
        amount: 1500,
        status: "delivered",
        date: "2024-01-20",
        hash: "d9c2f5a8e1b7d4c0f3a6b9d2e8f5c1a4",
        proofImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80",
        validatorMessage: "Food basket successfully distributed to the family. Five beneficiaries.",
        needTarget: 8000,
        needFunded: 8000,
    },
];
