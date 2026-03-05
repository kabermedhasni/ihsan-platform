export default function Footer() {
    return (
        <footer className="py-12 bg-background border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-white tracking-tighter">IHSAN</span>
                    </div>

                    <div className="text-muted-foreground text-sm text-center md:text-left">
                        © {new Date().getFullYear()} Ihsan Transparency Platform. All rights reserved.
                    </div>

                    <div className="flex gap-6 text-emerald-100/40 text-sm">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
