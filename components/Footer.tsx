import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-unicPurpleDark text-white py-16 mt-24">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-14">
                {/* Brand */}
                <div>
                    <Image src="/logo.png" alt="UNIC Logo" width={50} height={50} />
                    <h3 className="text-xl font-semibold mt-4">uniclawfirm</h3>
                    <p className="text-sm text-gray-300 mt-1">
                        Defending What Matters Most
                    </p>
                    <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                        A modern, paperless legal practice built for trust, clarity,
                        and the future of justice.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold text-unicGold mb-3">Explore</h4>
                    <ul className="space-y-3 text-gray-300 text-sm">
                        <li><Link href="/services" className="hover:text-white">Services</Link></li>
                        <li><Link href="/Judgements" className="hover:text-white">Judgments</Link></li>
                        <li><Link href="/library" className="hover:text-white">Library</Link></li>
                        <li><Link href="/file-case" className="hover:text-white">File a Case</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="font-semibold text-unicGold mb-3">Company</h4>
                    <ul className="space-y-3 text-gray-300 text-sm">
                        <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                        <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-white">Legal Notices</Link></li>
                        <li><Link href="#" className="hover:text-white">Support</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold text-unicGold mb-3">Contact</h4>
                    <p className="text-sm text-gray-300">info@uniclawfirm.com</p>
                    <p className="text-sm text-gray-300">+234 XXX XXXX</p>

                    <p className="text-gray-400 text-sm mt-4">
                        Lagos, Nigeria
                    </p>
                </div>
            </div>

            <div className="text-center text-xs text-gray-400 mt-12">
                © {new Date().getFullYear()} UNIC Law Firm — All Rights Reserved.
            </div>
        </footer>
    );
}
