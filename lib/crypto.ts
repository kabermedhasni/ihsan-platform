import crypto from "crypto";

/**
 * Generates a SHA-256 hash from a string.
 */
export function generateHash(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Generates a transaction hash, optionally linking to a previous hash.
 */
export function generateTransactionHash(
    txData: {
        transaction_id: string;
        need_id: string;
        donor_bank_number: string;
        validator_bank_number: string;
        amount: number;
        timestamp: string;
    },
    previousHash: string = ""
): string {
    const dataString =
        txData.transaction_id +
        txData.need_id +
        txData.donor_bank_number +
        txData.validator_bank_number +
        txData.amount.toString() +
        txData.timestamp +
        previousHash;

    return generateHash(dataString);
}
