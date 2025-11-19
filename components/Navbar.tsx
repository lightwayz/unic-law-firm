"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/judgments", label: "Judgments" },
    { href: "/library", label: "Library" },
    { href: "/file-case", label: "File a Case" },
    { href: "/about", label: "About" },
    { href: "/admin", label: "Admin" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-unicGold">UNIC</span> Law Firm
          </span>
                </Link>

                <button
                    className="lg:hidden border border-slate-700 rounded px-2 py-1 text-sm"
                    onClick={() => setOpen((v) => !v)}
                >
                    Menu
                </button>

                <div
                    className={`${
                        open ? "flex" : "hidden"
                    } lg:flex flex-col lg:flex-row gap-2 lg:gap-4 items-start lg:items-center text-sm`}
                >
                    {links.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-1 rounded-full ${
                                    active
                                        ? "bg-unicGold text-slate-950"
                                        : "text-slate-200 hover:bg-slate-800"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
}
