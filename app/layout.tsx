import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";

export const metadata: Metadata = {
    title: "UNIC Law Firm",
    description: "A digital-first, paperless, AI-assisted law firm.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        </body>
        </html>
    );
}
