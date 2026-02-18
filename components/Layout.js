import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-xl border-b border-brand-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-lg">
              ⚡
            </div>
            <span className="font-mono font-bold text-lg text-dark-50 tracking-widest">
              TRACKFLOW
            </span>
          </Link>

          <div className="flex gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all ${
                router.pathname === "/"
                  ? "text-brand-500 bg-brand-500/10"
                  : "text-dark-300 hover:text-dark-100"
              }`}
            >
              Track Shipment
            </Link>
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all ${
                router.pathname === "/admin"
                  ? "text-brand-500 bg-brand-500/10"
                  : "text-dark-300 hover:text-dark-100"
              }`}
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
