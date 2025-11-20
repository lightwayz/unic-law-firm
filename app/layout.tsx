import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { Nunito, Playfair_Display } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

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
        <body className={`${nunito.variable} ${playfair.variable} bg-slate-50 text-slate-900`}>
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        </body>
        </html>
    );
}
