export type TransactionStatus = "PENDING_VALIDATION" | "CONFIRMED" | "REJECTED";

export interface Transaction {
    id: string;
    needId: string;
    donorId: string;
    donorName?: string;
    donorBankNumber: string;
    validatorBankNumber: string;
    amount: number;
    timestamp: string;
    status: TransactionStatus;
    hash: string;
    previousHash: string;
    proofImageUrl?: string;
    location?: {
        city: string;
        district?: string;
    };
    category?: string;
}

export interface HashChainState {
    lastHash: string;
    totalTransactions: number;
}
