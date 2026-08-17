import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between p-4 sm:p-8">
      {/* Top Navbar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-on-primary font-bold text-sm tracking-tight">
            CQ
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-ink">
              Cafe QRBuddy
            </span>
            <span className="badge badge-sm bg-fin-orange text-on-primary text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 border-0 rounded">
              Fin AI
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-ink-muted">
          <a href="#help" className="hover:text-ink transition-colors">Help</a>
          <a href="#privacy" className="hover:text-ink transition-colors">Privacy</a>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex flex-col items-center justify-center my-8">
        <div className="w-full max-w-[420px] mx-auto">
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center py-4 text-xs text-ink-tertiary">
        <p>© {new Date().getFullYear()} Cafe QRBuddy, Inc. Built with Intercom Design System & daisyUI.</p>
      </footer>
    </div>
  );
}
