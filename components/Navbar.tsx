"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/judgments", label: "Judgments" },
    { href: "/library", label: "Library" },
    { href: "/file-case", label: "File a Case" },
    { href: "/about", label: "About" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">

                {/* Logo + Name */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.jpeg"
                        alt="UNIC Law Firm"
                        width={42}
                        height={42}
                        className="object-contain"
                    />
                    <div>
                        <h1 className="text-xl font-semibold text-unicPurple">uniclawfirm</h1>
                        <p className="text-xs text-gray-500 -mt-1">
                            Defending What Matters Most
                        </p>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-6 text-sm">
                    {links.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition font-medium ${
                                    active
                                        ? "text-unicPurple border-b-2 border-unicPurple pb-1"
                                        : "text-gray-700 hover:text-unicPurple"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Button */}
                <button
                    className="lg:hidden text-unicPurple"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={26} /> : <Menu size={26} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {open && (
                <div className="lg:hidden bg-white border-t border-gray-200 px-6 py-4">
                    <div className="flex flex-col gap-4">
                        {links.map((link) => {
                            const active = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`font-medium ${
                                        active ? "text-unicPurple" : "text-gray-700"
                                    }`}
                                    onClick={() => setOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
