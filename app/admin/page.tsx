"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if already logged in
        fetch("/api/admin/check")
            .then((res) => res.json())
            .then((data) => {
                if (data.isAdmin) {
                    router.push("/admin/dashboard");
                }
            });
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/admin/dashboard");
            } else {
                const data = await res.json();
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full glass-dark p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white mb-2">Admin Portal</h1>
                    <p className="text-slate-400">Master Control Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Secret Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm italic">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-premium bg-gradient-to-r from-indigo-600 to-violet-600 border-none text-white py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 transition-all"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Access Dashboard"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
