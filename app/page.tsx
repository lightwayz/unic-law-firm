"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
      <main className="mx-auto max-w-6xl px-4 py-12 space-y-16">
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
            >
              Justice, <span className="text-unicGold">Unbounded.</span>
            </motion.h1>
            <p className="text-slate-300 text-lg mb-6">
              UNIC Law Firm is a digital-first, paperless legal practice.
              File cases, access judgments, and browse our legal library — all in one unified platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                  href="/file-case"
                  className="rounded-lg bg-unicGold px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-yellow-400"
              >
                File a Case
              </Link>
              <Link
                  href="/library"
                  className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold hover:bg-slate-900"
              >
                Browse Library
              </Link>
            </div>
          </div>

          <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/40">
            <h2 className="font-semibold mb-4">Instant Access</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Choose your area of law and file a case online.</li>
              <li>• Track judgments and outcomes for similar matters.</li>
              <li>• Access UNIC’s internal archive of books and materials.</li>
              <li>• Fully digital, collaborative workflows for your team.</li>
            </ul>
          </div>
        </section>
      </main>
  );
}
