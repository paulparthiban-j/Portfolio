"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Portfolio render error:", error);
    }, [error]);

    return (
        <div className="fixed inset-0 bg-[#0A0A0B] flex items-center justify-center px-6 text-center">
            <div className="flex flex-col items-center gap-4 max-w-md">
                <span className="text-xs font-black tracking-[0.3em] text-emerald-500 uppercase">
                    Something went wrong
                </span>
                <p className="text-slate-400 text-sm">
                    The page hit an unexpected error while rendering. You can try again, or head back home.
                </p>
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all active:scale-95"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all active:scale-95"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
