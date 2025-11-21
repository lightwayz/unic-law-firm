// components/cases/HeaderGlassPanel.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeaderGlassPanel({
                                             title,
                                             subtitle,
                                             stats,
                                         }: {
    title: string;
    subtitle: string;
    stats: { label: string; value: string | number }[];
}) {
    return (
        <div className="relative w-full h-[230px] overflow-hidden rounded-3xl">
            {/* Glass base */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 backdrop-blur-2xl bg-white/20 border border-white/30 shadow-2xl shadow-slate-900/10 rounded-3xl"
            />

            {/* Soft purple glow */}
            <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute -top-24 -left-16 w-72 h-72 bg-unicPurple/30 blur-[120px] rounded-full"
            />

            {/* Horizontal hologram bar */}
            <motion.div
                animate={{ y: ["-120%", "200%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-16 bg-gradient-to-b from-white/12 via-transparent to-transparent"
            />

            {/* Orbital rings (subtle) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                className="absolute right-6 bottom-6 w-60 h-60 border border-white/10 rounded-full"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute right-16 bottom-10 w-40 h-40 border border-white/10 rounded-full"
            />

            {/* Foreground content */}
            <div className="relative z-10 h-full px-6 sm:px-8 flex flex-col justify-center">
                <div className="flex items-center gap-4">
                    <Image
                        src="/logo.jpeg"
                        alt="UNIC Law Logo"
                        width={50}
                        height={50}
                        className="rounded-xl shadow-md shadow-slate-900/20 border border-white/60 bg-white"
                    />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif text-unicPurpleDark">
                            {title}
                        </h1>
                        <p className="text-sm text-slate-700 mt-1">{subtitle}</p>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="px-4 py-2 rounded-2xl bg-white/70 backdrop-blur border border-white/80 shadow-sm shadow-slate-900/10"
                        >
                            <p className="text-[11px] text-slate-600 uppercase tracking-[0.12em]">
                                {s.label}
                            </p>
                            <p className="text-lg font-semibold text-slate-900">{s.value}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
