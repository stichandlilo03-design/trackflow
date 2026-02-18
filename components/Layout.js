import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children, isAdmin = false }) {
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

          <div className="flex gap-1 items-center">
            {isAdmin ? (
              <>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg text-sm font-medium no-underline text-dark-300 hover:text-dark-100 transition-all"
                >
                  ← Back to Site
                </Link>
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500/10 text-brand-500 border border-brand-500/20">
                  🔒 Admin
                </span>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer for customer pages only */}
      {!isAdmin && (
        <footer className="border-t border-dark-700/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-xs">
                ⚡
              </div>
              <span className="font-mono font-bold text-sm text-dark-400 tracking-widest">
                TRACKFLOW
              </span>
            </div>
            <p className="text-dark-500 text-xs">
              &copy; {new Date().getFullYear()} TrackFlow. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
