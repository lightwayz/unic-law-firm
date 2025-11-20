"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Gavel, Scale, BookText } from "lucide-react";

export default function HomePage() {
  return (
      <main className="mx-auto max-w-7xl px-6 py-16 space-y-24">

        {/* HERO */}
        <section className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: brand & text */}
          <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
          >
            <Image
                src="/logo.png"
                width={90}
                height={90}
                alt="UNIC Logo"
                className="mb-6"
            />

            <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-5 text-unicPurpleDark">
              Defending <br />
              <span className="text-unicPurple">What Matters Most.</span>
            </h1>

            <p className="text-gray-700 text-lg max-w-lg leading-relaxed mb-8">
              UNIC Law Firm merges legal excellence with modern, paperless
              technology. Experience clarity, confidence, and seamless access
              to justice — all in one intelligent platform.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                  href="/file-case"
                  className="bg-unicPurple text-white px-6 py-3 rounded-lg font-semibold hover:bg-unicPurpleLite transition"
              >
                File a Case
              </Link>
              <Link
                  href="/services"
                  className="border border-unicPurple px-6 py-3 rounded-lg font-semibold text-unicPurple hover:bg-unicPurple/5 transition"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>

          {/* Right: gradient card */}
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative bg-gradient-to-br from-unicPurpleDark to-unicPurpleLite p-8 rounded-2xl shadow-2xl text-white"
          >
            <h3 className="text-2xl font-serif mb-3">Your Digital Law Partner</h3>
            <p className="text-sm leading-relaxed max-w-sm text-gray-100">
              Access legal documents, track case progress, and collaborate with
              our team — all from your secure online portal.
            </p>
            <Image
                src="/logo.png"
                alt="UNIC Overlay"
                width={60}
                height={60}
                className="absolute bottom-6 right-6 opacity-20"
            />
          </motion.div>
        </section>

        {/* PRACTICE AREAS */}
        <section>
          <h2 className="text-3xl font-serif font-semibold mb-3">Practice Areas</h2>
          <p className="text-gray-600 max-w-2xl mb-8">
            Explore the core areas of law handled by our team of seasoned professionals.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area) => (
                <Link
                    key={area.slug}
                    href={`/services/${area.slug}`}
                    className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-unicPurple/40 hover:shadow-md transition flex flex-col gap-3"
                >
                  <area.icon className="h-8 w-8 text-unicPurple" />
                  <h3 className="font-semibold text-lg text-gray-900">{area.name}</h3>
                  <p className="text-sm text-gray-600">{area.desc}</p>
                </Link>
            ))}
          </div>
        </section>

        {/* WORKFLOW */}
        <section>
          <h2 className="text-3xl font-serif font-semibold mb-6">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm"
                >
                  <div className="text-unicPurple text-3xl font-bold mb-2">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </motion.div>
            ))}
          </div>
        </section>

        {/* JUDGMENTS */}
        <section>
          <h2 className="text-3xl font-serif font-semibold mb-6">Recent Judgments</h2>

          <div className="space-y-4">
            {mockJudgments.map((j) => (
                <div
                    key={j.id}
                    className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm"
                >
                  <h3 className="font-semibold text-lg text-gray-900">{j.title}</h3>
                  <p className="text-sm text-gray-600">{j.area}</p>
                  <p className="text-sm font-bold text-unicPurple mt-1">
                    Outcome: {j.outcome}
                  </p>
                </div>
            ))}
          </div>

          <Link
              href="/judgments"
              className="inline-flex items-center gap-2 mt-6 font-semibold text-unicPurple hover:text-unicPurpleLite transition"
          >
            View all judgments
          </Link>
        </section>

        {/* CTA */}
        <section className="text-center bg-unicPurpleDark text-white p-12 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
            Ready to Begin Your Legal Journey?
          </h2>
          <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto mb-8">
            Whether you're filing a case, researching legal precedents,
            or collaborating with our team — UNIC Law Firm is fully equipped
            for a digital-first experience.
          </p>

          <Link
              href="/file-case"
              className="bg-white text-unicPurpleDark px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            File a Case Online
          </Link>
        </section>
      </main>
  );
}

const practiceAreas = [
  {
    slug: "criminal-law",
    name: "Criminal Law",
    desc: "Defense, trial representation, investigations, appeals.",
    icon: Gavel,
  },
  {
    slug: "civil-litigation",
    name: "Civil & Commercial Litigation",
    desc: "Corporate disputes, contract enforcement, commercial claims.",
    icon: Scale,
  },
  {
    slug: "intellectual-property",
    name: "Intellectual Property",
    desc: "Trademarks, copyrights, patents & creative works protection.",
    icon: BookText,
  },
  {
    slug: "family-law",
    name: "Family Law",
    desc: "Custody, divorce, maintenance & guardianship matters.",
    icon: Gavel,
  },
  {
    slug: "employment-law",
    name: "Employment Law",
    desc: "Labour disputes, wrongful termination, workplace rights.",
    icon: Scale,
  },
  {
    slug: "business-law",
    name: "Business Law",
    desc: "Compliance, company formation, legal advisory.",
    icon: BookText,
  },
];

const workflowSteps = [
  {
    title: "Select Case Type",
    desc: "Choose the legal area that applies to your issue.",
  },
  {
    title: "Upload Documents",
    desc: "Easily submit your case-related materials digitally.",
  },
  {
    title: "We Review & Assign",
    desc: "Your case is reviewed and assigned to a qualified attorney.",
  },
  {
    title: "Track Case Progress",
    desc: "Monitor updates through our fully digital client portal.",
  },
];

const mockJudgments = [
  {
    id: "1",
    title: "ABC Ltd v. XYZ PLC",
    area: "Civil Litigation",
    outcome: "Judgment for Claimant",
  },
  {
    id: "2",
    title: "Doe v. State",
    area: "Criminal Defense",
    outcome: "Acquittal",
  },
];
