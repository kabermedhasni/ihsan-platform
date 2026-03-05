export default function ReceiptPage({ params }: { params: { transactionId: string } }) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-white mb-4">Receipt for Transaction {params.transactionId}</h1>
            <p className="text-emerald-100/60">Receipt details loading...</p>
        </div>
    );
}
