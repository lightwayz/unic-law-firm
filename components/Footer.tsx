export default function Footer() {
    return (
        <footer className="border-t border-slate-800 mt-16">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p>
                    © {new Date().getFullYear()} UNIC Law Firm. All rights reserved.
                </p>
                <p className="text-xs">
                    Powered by a paperless, AI-assisted legal workflow.
                </p>
            </div>
        </footer>
    );
}
