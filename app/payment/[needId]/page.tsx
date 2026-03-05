export default function PaymentPage({ params }: { params: { needId: string } }) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-white mb-4">Payment for Need {params.needId}</h1>
            <p className="text-emerald-100/60">Payment gateway integration in progress...</p>
        </div>
    );
}
