import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Project Tracker</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-slate-600 hover:text-blue-600">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            New: Smart Task Prioritization
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Manage Projects <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Without the Chaos.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed">
            The simple, fast, and powerful way to track your team's progress. 
            Build, ship, and celebrate your wins in one beautiful place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-xl gap-2 shadow-xl shadow-slate-200">
                Go to Dashboard <LayoutDashboard className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-200 hover:bg-slate-50 rounded-xl gap-2">
                Learn More <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* --- Mockup Preview --- */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2rem] blur-2xl opacity-50"></div>
            <div className="relative bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden aspect-video flex items-center justify-center group">
               <div className="text-slate-400 group-hover:scale-105 transition-transform duration-500">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-64 h-4 bg-slate-200 rounded-full"></div>
                    <div className="w-48 h-4 bg-slate-200 rounded-full opacity-50"></div>
                    <p className="text-sm font-medium mt-4">Your Dashboard Preview will be here</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- Features --- */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Real-time Tracking", desc: "See every update as it happens without refreshing." },
              { title: "Team Collaboration", desc: "Assign tasks and share feedback in seconds." },
              { title: "Smart Analytics", desc: "Get insights into your team's productivity." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}