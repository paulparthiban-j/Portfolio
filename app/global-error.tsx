"use client";

import { useEffect } from "react";

// Catches errors thrown by the root layout itself (fonts, providers, etc.)
// where app/error.tsx can't help because it renders inside that same layout.
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Portfolio root layout error:", error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ background: "#0A0A0B", color: "#fff", fontFamily: "sans-serif" }}>
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "1rem",
                        textAlign: "center",
                        padding: "1.5rem",
                    }}
                >
                    <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "28rem" }}>
                        The page failed to load. Please try again.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            padding: "0.75rem 1.5rem",
                            background: "#10b981",
                            color: "#fff",
                            border: "none",
                            borderRadius: "9999px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
