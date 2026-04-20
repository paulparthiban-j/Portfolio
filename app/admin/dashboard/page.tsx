"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RANDOM_THEMES = [
    // Dark Themes
    { primaryGradient: "from-indigo-600 to-violet-600", accent: "indigo-500", bg: "from-[#0f172a] via-[#1e1b4b] to-black", mode: "dark", name: "Midnight Galaxy" },
    { primaryGradient: "from-emerald-500 to-teal-600", accent: "emerald-500", bg: "from-[#064e3b] via-[#022c22] to-black", mode: "dark", name: "Emerald Forest" },
    { primaryGradient: "from-rose-500 to-orange-600", accent: "rose-500", bg: "from-[#450a0a] via-[#1c1917] to-black", mode: "dark", name: "Crimson Sunset" },
    { primaryGradient: "from-blue-600 to-cyan-500", accent: "blue-500", bg: "from-[#1e3a8a] via-[#111827] to-black", mode: "dark", name: "Oceanic Deep" },
    { primaryGradient: "from-amber-500 to-yellow-600", accent: "amber-400", bg: "from-[#451a03] via-[#0c0a09] to-black", mode: "dark", name: "Golden Ember" },
    { primaryGradient: "from-fuchsia-600 to-purple-600", accent: "fuchsia-500", bg: "from-[#4a044e] via-[#1e1b4b] to-black", mode: "dark", name: "Neon Nebula" },

    // Light Themes
    { primaryGradient: "from-blue-500 to-indigo-600", accent: "blue-600", bg: "from-slate-50 via-blue-100/20 to-white", mode: "light", name: "Skyline Light" },
    { primaryGradient: "from-purple-500 to-pink-500", accent: "purple-600", bg: "from-purple-50 via-pink-50/30 to-white", mode: "light", name: "Lavender Morning" },
    { primaryGradient: "from-emerald-500 to-teal-600", accent: "emerald-600", bg: "from-emerald-50 via-teal-50/30 to-white", mode: "light", name: "Minty Fresh" },
    { primaryGradient: "from-orange-400 to-rose-500", accent: "orange-600", bg: "from-orange-50 via-rose-50/20 to-white", mode: "light", name: "Summer Breeze" }
];

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("general");
    const [resumeUploading, setResumeUploading] = useState(false);
    const [resumeMessage, setResumeMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/admin/check");
                const auth = await res.json();
                if (!auth.isAdmin) {
                    router.push("/admin");
                    return;
                }

                const portfolioRes = await fetch("/api/portfolio");
                const portfolioData = await portfolioRes.json();

                // Ensure all arrays exist
                if (!portfolioData.projects) portfolioData.projects = [];
                if (!portfolioData.experience) portfolioData.experience = [];
                if (!portfolioData.education) portfolioData.education = [];
                if (!portfolioData.customSections) portfolioData.customSections = [];
                if (!portfolioData.stats) portfolioData.stats = [];
                if (!portfolioData.testimonials) portfolioData.testimonials = [];
                if (!portfolioData.certifications) portfolioData.certifications = [];

                setData(portfolioData);
            } catch (err) {
                console.error("Auth check failed", err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setMessage("Portfolio updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to update portfolio.");
            }
        } catch (err) {
            setMessage("An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    const generateRandomTheme = () => {
        const theme = RANDOM_THEMES[Math.floor(Math.random() * RANDOM_THEMES.length)];
        setData({
            ...data,
            theme: {
                ...data.theme,
                ...theme,
                autoTheme: false
            }
        });
        setMessage(`Applied ${theme.name} theme! Don't forget to save.`);
        setTimeout(() => setMessage(""), 3000);
    };

    const logout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setResumeMessage("Only PDF files are allowed.");
            setTimeout(() => setResumeMessage(""), 3000);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setResumeMessage("File must be under 5MB.");
            setTimeout(() => setResumeMessage(""), 3000);
            return;
        }

        setResumeUploading(true);
        setResumeMessage("");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const res = await fetch("/api/admin/resume", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                setResumeMessage("Resume uploaded successfully!");
                setData({ ...data, resumeUrl: "/resume.pdf" });
            } else {
                setResumeMessage(result.error || "Upload failed.");
            }
        } catch {
            setResumeMessage("Upload failed. Please try again.");
        } finally {
            setResumeUploading(false);
            setTimeout(() => setResumeMessage(""), 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 glass-dark p-6 rounded-[2rem] border border-white/5 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white">Portfolio Master Control</h1>
                        <p className="text-slate-400">Customize your digital presence in real-time</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={generateRandomTheme} className="btn btn-outline border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 rounded-xl">
                            🎲 Random Theme
                        </button>
                        <button onClick={handleSave} disabled={saving} className="btn btn-premium bg-gradient-to-r from-indigo-600 to-violet-600 border-none text-white px-8 rounded-xl shadow-lg hover:shadow-indigo-500/20">
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button onClick={logout} className="btn btn-ghost text-slate-400 hover:text-white">
                            Logout
                        </button>
                    </div>
                </header>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-center font-medium transition-all ${message.includes("success") || message.includes("Applied") ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                        {message}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        { id: "general", label: "Identity", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
                        { id: "appearance", label: "Aesthetics", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg> },
                        { id: "skills", label: "The Stack", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
                        { id: "stats", label: "Metrics", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                        { id: "projects", label: "Innovation", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
                        { id: "experience", label: "Journey", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> },
                        { id: "education", label: "Foundation", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
                        { id: "credibility", label: "Social Proof", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
                        { id: "custom", label: "Extensions", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                    <a href="/" target="_blank" className="px-6 py-2 rounded-xl text-sm font-bold text-indigo-400 hover:bg-white/5 ml-auto">
                        Preview Portfolio ↗
                    </a>
                </div>

                <div className="space-y-8">
                    {activeTab === "general" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Identity
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 col-span-1">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                        <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Professional Title</label>
                                        <input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Subtitle</label>
                                        <input type="text" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">About Section Title</label>
                                        <input type="text" placeholder="WHO AM I" value={data.aboutTitle || ""} onChange={(e) => setData({ ...data, aboutTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-4 col-span-1">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                        <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none h-44" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Bold Statement (Impact Headline)</label>
                                        <input type="text" value={data.boldStatement || ""} onChange={(e) => setData({ ...data, boldStatement: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="I build scalable React systems..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Current Work (Live Status)</label>
                                        <input type="text" value={data.currentWork || ""} onChange={(e) => setData({ ...data, currentWork: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Architecting performance-first React systems..." />
                                    </div>
                                </div>
                                <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                        <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                                        <input type="text" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                                        <input type="text" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">GitHub URL</label>
                                        <input type="text" value={data.github || ""} onChange={(e) => setData({ ...data, github: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">LinkedIn URL</label>
                                        <input type="text" value={data.linkedin || ""} onChange={(e) => setData({ ...data, linkedin: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">X (Twitter) URL</label>
                                        <input type="text" value={data.twitter || ""} onChange={(e) => setData({ ...data, twitter: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Resume URL (e.g. /resume.pdf)</label>
                                        <input type="text" value={data.resumeUrl || ""} onChange={(e) => setData({ ...data, resumeUrl: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Upload / Replace Resume PDF</label>
                                        <div className="flex items-center gap-4">
                                            <label className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all ${resumeUploading ? "opacity-50 pointer-events-none" : ""}`}>
                                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                <span className="text-sm font-medium text-slate-300">
                                                    {resumeUploading ? "Uploading..." : "Choose PDF file (max 5MB)"}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleResumeUpload}
                                                    className="hidden"
                                                    disabled={resumeUploading}
                                                />
                                            </label>
                                            {data.resumeUrl && (
                                                <a
                                                    href={data.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 text-sm font-bold hover:bg-indigo-600/30 transition-all whitespace-nowrap"
                                                >
                                                    Preview CV
                                                </a>
                                            )}
                                        </div>
                                        {resumeMessage && (
                                            <p className={`mt-2 text-sm font-medium ${resumeMessage.includes("success") ? "text-emerald-400" : "text-red-400"}`}>
                                                {resumeMessage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "appearance" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                Aesthetics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-slate-300 font-medium">Theme Mode</span>
                                        <select value={data.theme?.mode || "dark"} onChange={(e) => setData({ ...data, theme: { ...data.theme, mode: e.target.value } })} className="bg-slate-800 text-white rounded-lg px-4 py-2 outline-none border border-white/10">
                                            <option value="dark">Dark</option>
                                            <option value="light">Light</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-slate-300 font-medium">Auto Theme Detection</span>
                                        <input type="checkbox" className="toggle toggle-primary" checked={data.theme?.autoTheme} onChange={(e) => setData({ ...data, theme: { ...data.theme, autoTheme: e.target.checked } })} />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-slate-300 font-medium">Transition Animation</span>
                                        <select value={data.theme?.animationStyle || "side"} onChange={(e) => setData({ ...data, theme: { ...data.theme, animationStyle: e.target.value } })} className="bg-slate-800 text-white rounded-lg px-4 py-2 outline-none border border-white/10">
                                            <option value="side">Side Slide (Modern)</option>
                                            <option value="git-push">Git Push (Vertical)</option>
                                            <option value="fade">Smooth Fade</option>
                                            <option value="scale">Original Scale</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                    <h3 className="text-indigo-400 font-bold mb-2">Current Theme: {data.theme?.name || "Custom"}</h3>
                                    <p className="text-sm text-slate-400">Your theme defines the gradients, accent colors, and backgrounds across the entire portfolio.</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "skills" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 animate-fade-in">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                The Stack
                            </h2>
                            <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Display Section Title (e.g. THE STACK)</label>
                                <input type="text" placeholder="THE STACK" value={data.skillsTitle || ""} onChange={(e) => setData({ ...data, skillsTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Add New Skill</label>
                                        <input
                                            id="new-skill-name"
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Skill Name (e.g. React)"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Icon Slug/URL (Optional)</label>
                                        <input
                                            id="new-skill-icon"
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g. nextdotjs or https://..."
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const nameInput = document.getElementById('new-skill-name') as HTMLInputElement;
                                            const iconInput = document.getElementById('new-skill-icon') as HTMLInputElement;
                                            if (nameInput.value) {
                                                setData({
                                                    ...data,
                                                    skills: [...data.skills, { name: nameInput.value, icon: iconInput.value }]
                                                });
                                                nameInput.value = '';
                                                iconInput.value = '';
                                            }
                                        }}
                                        className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl px-6 h-[50px]"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-normal">
                                    {data.skills.map((skill: any, i: number) => {
                                        const skillObj = typeof skill === 'string' ? { name: skill, icon: '' } : skill;
                                        return (
                                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={skillObj.icon?.startsWith('http') ? skillObj.icon : `https://cdn.simpleicons.org/${skillObj.icon || skillObj.name.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}/fff`}
                                                            alt=""
                                                            className="w-6 h-6 object-contain"
                                                            onError={(e) => (e.currentTarget.src = 'https://www.svgrepo.com/show/452228/html-5.svg')}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{skillObj.name}</div>
                                                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{skillObj.icon || 'Auto-fetched'}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setData({ ...data, skills: data.skills.filter((_: any, idx: number) => idx !== i) })}
                                                    className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "stats" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 animate-fade-in">
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    Metrics
                                </h2>
                                <button onClick={() => setData({ ...data, stats: [...(data.stats || []), { number: 0, label: "", suffix: "" }] })} className="btn btn-sm btn-outline text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
                                    + Add Stat
                                </button>
                            </div>
                            <div className="space-y-6">
                                {(data.stats || []).map((stat: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative group">
                                        <button onClick={() => setData({ ...data, stats: data.stats.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-1">
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Number</label>
                                                <input 
                                                    type="number" 
                                                    value={stat.number || 0} 
                                                    onChange={(e) => { const newStats = [...data.stats]; newStats[idx].number = parseInt(e.target.value) || 0; setData({ ...data, stats: newStats }); }} 
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Label</label>
                                                <input 
                                                    type="text" 
                                                    value={stat.label || ""} 
                                                    onChange={(e) => { const newStats = [...data.stats]; newStats[idx].label = e.target.value; setData({ ...data, stats: newStats }); }} 
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                    placeholder="e.g. Projects Completed"
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Suffix (Optional)</label>
                                                <input 
                                                    type="text" 
                                                    value={stat.suffix || ""} 
                                                    onChange={(e) => { const newStats = [...data.stats]; newStats[idx].suffix = e.target.value; setData({ ...data, stats: newStats }); }} 
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                    placeholder="e.g. +"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!data.stats || data.stats.length === 0) && (
                                    <div className="text-center py-10 text-slate-500 italic">
                                        No stats yet. Add some impressive metrics to showcase your achievements!
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === "projects" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 animate-fade-in">
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Innovation
                                </h2>
                                <button onClick={() => setData({ ...data, projects: [...(data.projects || []), { title: "", description: "", tech: "", link: "", github: "" }] })} className="btn btn-sm btn-outline text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
                                    + Add Project
                                </button>
                            </div>
                            <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Display Section Title (e.g. PROJECTS)</label>
                                <input type="text" placeholder="PROJECTS" value={data.projectsTitle || ""} onChange={(e) => setData({ ...data, projectsTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="space-y-6">
                                    {(data.projects || []).map((proj: any, idx: number) => (
                                        <div key={idx} className="p-8 bg-white/5 rounded-3xl border border-white/10 relative group">
                                            <button onClick={() => setData({ ...data, projects: data.projects.filter((_: any, i: number) => i !== idx) })} className="absolute top-6 right-8 text-red-500 font-bold p-2 hover:bg-red-500/10 rounded-lg transition-all">Remove Project</button>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Headline</label>
                                                        <input placeholder="Project Title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500" value={proj.title} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].title = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Short Mission Description</label>
                                                        <textarea placeholder="Briefly describe the project..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm outline-none focus:border-indigo-500 h-24" value={proj.description} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].description = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Tech Stack</label>
                                                            <input placeholder="React, Node.js..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-indigo-300 outline-none focus:border-indigo-500" value={proj.tech} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].tech = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Banner Image URL</label>
                                                            <input placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-emerald-400 outline-none focus:border-indigo-500" value={proj.icon || ''} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].icon = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Live Mission Link</label>
                                                            <input placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-indigo-400 outline-none focus:border-indigo-500" value={proj.link} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].link = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Source Repository</label>
                                                            <input placeholder="https://github..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-indigo-400 outline-none focus:border-indigo-500" value={proj.github} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].github = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">The Critical Problem</label>
                                                        <textarea placeholder="What business problem did this solve?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-red-300 text-xs outline-none focus:border-red-500 h-20" value={proj.problem || ""} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].problem = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">The Engineering Solution</label>
                                                        <textarea placeholder="How did you solve it technically?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-emerald-300 text-xs outline-none focus:border-emerald-500 h-20" value={proj.solution || ""} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].solution = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Technical Architecture Deep Dive</label>
                                                        <textarea placeholder="Microservices, state machines, etc..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-slate-300 text-xs outline-none focus:border-indigo-500 h-20" value={proj.architecture || ""} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].architecture = e.target.value; setData({ ...data, projects: newProj }); }} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Measurable Impact (Enter each impact on a new line)</label>
                                                        <textarea placeholder="e.g. 40% reduction in latency" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-indigo-500 h-20" value={(proj.impact || []).join('\n')} onChange={(e) => { const newProj = [...data.projects]; newProj[idx].impact = e.target.value.split('\n').filter(Boolean); setData({ ...data, projects: newProj }); }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        </section>
                    )}

                    {activeTab === "experience" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 animate-fade-in">
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                    Journey
                                </h2>
                                <button onClick={() => setData({ ...data, experience: [...(data.experience || []), { company: "", position: "", duration: "", description: "" }] })} className="btn btn-sm btn-outline text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
                                    + Add Experience
                                </button>
                            </div>
                            <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Display Section Title (e.g. THE JOURNEY)</label>
                                <input type="text" placeholder="THE JOURNEY" value={data.experienceTitle || ""} onChange={(e) => setData({ ...data, experienceTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="space-y-4">
                                {(data.experience || []).map((exp: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative">
                                        <button onClick={() => setData({ ...data, experience: data.experience.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500">Remove</button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input placeholder="Company" className="bg-transparent border-b border-white/10 py-1 text-white outline-none focus:border-indigo-500" value={exp.company} onChange={(e) => { const newExp = [...data.experience]; newExp[idx].company = e.target.value; setData({ ...data, experience: newExp }); }} />
                                            <input placeholder="Position" className="bg-transparent border-b border-white/10 py-1 text-white outline-none focus:border-indigo-500" value={exp.position} onChange={(e) => { const newExp = [...data.experience]; newExp[idx].position = e.target.value; setData({ ...data, experience: newExp }); }} />
                                            <input placeholder="Duration" className="bg-transparent border-b border-white/10 py-1 text-white outline-none focus:border-indigo-500" value={exp.duration} onChange={(e) => { const newExp = [...data.experience]; newExp[idx].duration = e.target.value; setData({ ...data, experience: newExp }); }} />
                                        </div>
                                        <textarea placeholder="Description" className="w-full bg-transparent border-b border-white/10 py-1 text-slate-400 text-sm outline-none focus:border-indigo-500 mt-3 h-20" value={exp.description} onChange={(e) => { const newExp = [...data.experience]; newExp[idx].description = e.target.value; setData({ ...data, experience: newExp }); }} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === "education" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 animate-fade-in">
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    Foundation
                                </h2>
                                <button onClick={() => setData({ ...data, education: [...(data.education || []), { institution: "", degree: "", year: "" }] })} className="btn btn-sm btn-outline text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
                                    + Add Education
                                </button>
                            </div>
                            <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Display Section Title (e.g. THE FOUNDATION)</label>
                                <input type="text" placeholder="THE FOUNDATION" value={data.educationTitle || ""} onChange={(e) => setData({ ...data, educationTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(data.education || []).map((edu: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative">
                                        <button onClick={() => setData({ ...data, education: data.education.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500">Remove</button>
                                        <input placeholder="Institution" className="w-full bg-transparent border-b border-white/10 py-1 text-white font-bold outline-none focus:border-indigo-500 mb-2" value={edu.institution} onChange={(e) => { const newEdu = [...data.education]; newEdu[idx].institution = e.target.value; setData({ ...data, education: newEdu }); }} />
                                        <input placeholder="Degree" className="w-full bg-transparent border-b border-white/10 py-1 text-slate-300 outline-none focus:border-indigo-500 mb-2" value={edu.degree} onChange={(e) => { const newEdu = [...data.education]; newEdu[idx].degree = e.target.value; setData({ ...data, education: newEdu }); }} />
                                        <div className="flex gap-4">
                                            <input placeholder="Year" className="flex-1 bg-transparent border-b border-white/10 py-1 text-indigo-400 outline-none focus:border-indigo-500" value={edu.year} onChange={(e) => { const newEdu = [...data.education]; newEdu[idx].year = e.target.value; setData({ ...data, education: newEdu }); }} />
                                            <input placeholder="GPA / Percentage" className="flex-1 bg-transparent border-b border-white/10 py-1 text-emerald-400 outline-none focus:border-indigo-500" value={edu.gpa || ""} onChange={(e) => { const newEdu = [...data.education]; newEdu[idx].gpa = e.target.value; setData({ ...data, education: newEdu }); }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === "credibility" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 animate-fade-in space-y-12">
                            <div>
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                        Testimonials
                                    </h2>
                                    <button onClick={() => setData({ ...data, testimonials: [...(data.testimonials || []), { name: "", role: "", text: "" }] })} className="btn btn-sm btn-outline text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
                                        + Add Testimonial
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(data.testimonials || []).map((t: any, idx: number) => (
                                        <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative">
                                            <button onClick={() => setData({ ...data, testimonials: data.testimonials.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500">Remove</button>
                                            <input placeholder="Person Name" className="w-full bg-transparent border-b border-white/10 py-1 text-white font-bold outline-none focus:border-indigo-500 mb-2" value={t.name} onChange={(e) => { const newT = [...data.testimonials]; newT[idx].name = e.target.value; setData({ ...data, testimonials: newT }); }} />
                                            <input placeholder="Current Professional Role" className="w-full bg-transparent border-b border-white/10 py-1 text-slate-400 text-sm outline-none focus:border-indigo-500 mb-2" value={t.role} onChange={(e) => { const newT = [...data.testimonials]; newT[idx].role = e.target.value; setData({ ...data, testimonials: newT }); }} />
                                            <textarea placeholder="Their recommendation/feedback..." className="w-full bg-transparent border-b border-white/10 py-1 text-slate-300 text-sm outline-none focus:border-indigo-500 h-24 italic" value={t.text} onChange={(e) => { const newT = [...data.testimonials]; newT[idx].text = e.target.value; setData({ ...data, testimonials: newT }); }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        Certifications
                                    </h2>
                                    <button onClick={() => setData({ ...data, certifications: [...(data.certifications || []), { name: "", issuer: "", year: "" }] })} className="btn btn-sm btn-outline text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
                                        + Add Certification
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {(data.certifications || []).map((c: any, idx: number) => (
                                        <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative">
                                            <button onClick={() => setData({ ...data, certifications: data.certifications.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500">Remove</button>
                                            <input placeholder="Certification Name" className="w-full bg-transparent border-b border-white/10 py-1 text-white font-bold outline-none focus:border-indigo-500 mb-2" value={c.name} onChange={(e) => { const newC = [...data.certifications]; newC[idx].name = e.target.value; setData({ ...data, certifications: newC }); }} />
                                            <input placeholder="Issuer (e.g. Meta, Google)" className="w-full bg-transparent border-b border-white/10 py-1 text-slate-400 text-sm outline-none focus:border-indigo-500 mb-2" value={c.issuer} onChange={(e) => { const newC = [...data.certifications]; newC[idx].issuer = e.target.value; setData({ ...data, certifications: newC }); }} />
                                            <input placeholder="Year" className="w-full bg-transparent border-b border-white/10 py-1 text-indigo-400 outline-none focus:border-indigo-500" value={c.year} onChange={(e) => { const newC = [...data.certifications]; newC[idx].year = e.target.value; setData({ ...data, certifications: newC }); }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "custom" && (
                        <section className="glass-dark p-8 rounded-[2rem] border border-white/5 animate-fade-in">
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                    Extensions
                                </h2>
                                <button onClick={() => setData({ ...data, customSections: [...(data.customSections || []), { title: "", content: "" }] })} className="btn btn-sm btn-outline text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
                                    + Add New Section
                                </button>
                            </div>
                            <div className="space-y-6">
                                {(data.customSections || []).map((sect: any, idx: number) => (
                                    <div key={idx} className="p-8 bg-white/5 rounded-3xl border border-white/10 relative">
                                        <button onClick={() => setData({ ...data, customSections: data.customSections.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500">Remove Section</button>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Section Title</label>
                                                <input placeholder="e.g. Awards, volunteering, My Philosophy" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={sect.title} onChange={(e) => { const newSect = [...data.customSections]; newSect[idx].title = e.target.value; setData({ ...data, customSections: newSect }); }} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Section Content</label>
                                                <textarea placeholder="Write anything you want here..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 h-40" value={sect.content} onChange={(e) => { const newSect = [...data.customSections]; newSect[idx].content = e.target.value; setData({ ...data, customSections: newSect }); }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!data.customSections || data.customSections.length === 0) && (
                                    <div className="text-center py-10 text-slate-500 italic">
                                        No custom sections yet. Add one to expand your portfolio!
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                <div className="mt-12 text-center text-slate-500 text-sm italic">
                    Tip: Use the tabs to move between different parts of your portfolio. Everything is saved to portfolio.json.
                </div>
            </div>
        </div>
    );
}
