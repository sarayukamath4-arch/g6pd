"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Camera, ClipboardList, ArrowRight } from "lucide-react";

const recent = [
  {
    product: "Example medication",
    reaction: "Fatigue",
    date: "Today",
  },
  {
    product: "Packaged food",
    reaction: "Headache",
    date: "18 Aug",
  },
  {
    product: "Skincare product",
    reaction: "Skin irritation",
    date: "12 Aug",
  },
];

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to GeneGuide</h1>
          <p className="text-slate-600 mb-6">Please sign in to continue</p>
          <Link
            href="/auth/login"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <p className="text-xs font-semibold text-emerald-600 mb-2">YOUR HEALTH COMPANION</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Good evening.
        </h1>
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full text-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          G6PD deficiency
        </div>
      </header>

      <section className="bg-emerald-50 rounded-2xl p-6 md:p-8 mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-emerald-600 mb-2">YOUR CONDITION</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Understand what your condition means.
          </h2>
          <p className="text-slate-600 mb-6">
            Explore condition-specific information, investigate substances,
            and keep track of your own experiences — all in one place.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Explore G6PD
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <div className="mb-8">
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">QUICK ACTIONS</p>
          <h2 className="text-xl font-bold text-slate-900">What would you like to do?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/search"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Search a substance</h3>
            <p className="text-sm text-slate-600 mb-4">
              Check medicines, foods, ingredients and chemicals against
              condition-specific evidence.
            </p>
            <span className="text-sm font-semibold text-emerald-600">Search now →</span>
          </Link>

          <Link
            href="/scanner"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Camera className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Scan a label</h3>
            <p className="text-sm text-slate-600 mb-4">
              Photograph a product label and review its ingredients before
              analysing them.
            </p>
            <span className="text-sm font-semibold text-emerald-600">Try scanner →</span>
          </Link>

          <Link
            href="/journal"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Log a reaction</h3>
            <p className="text-sm text-slate-600 mb-4">
              Record what happened, when it happened and what you were
              exposed to.
            </p>
            <span className="text-sm font-semibold text-emerald-600">Open journal →</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">PERSONAL JOURNAL</p>
              <h2 className="text-lg font-bold text-slate-900">Recent observations</h2>
            </div>
            <Link href="/journal" className="text-sm text-emerald-600 hover:underline">
              View all →
            </Link>
          </div>

          {recent.map((item, index) => (
            <div key={index} className="flex items-center gap-3 py-3 border-t border-slate-100">
              <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">
                ●
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{item.product}</p>
                <p className="text-xs text-slate-500">{item.reaction}</p>
              </div>
              <span className="text-xs text-slate-400">{item.date}</span>
            </div>
          ))}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 mb-2">HOW WE PRESENT INFORMATION</p>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Evidence, not guesses.</h2>
          <p className="text-sm text-slate-600 mb-6">
            GeneGuide separates scientific evidence from your personal
            observations.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
              <div>
                <p className="font-medium text-slate-900">Established evidence</p>
                <p className="text-xs text-slate-500">Supported by reliable sources</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2"></span>
              <div>
                <p className="font-medium text-slate-900">Limited evidence</p>
                <p className="text-xs text-slate-500">Some evidence, but uncertainty remains</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 bg-slate-400 rounded-full mt-2"></span>
              <div>
                <p className="font-medium text-slate-900">Unclear</p>
                <p className="text-xs text-slate-500">Insufficient evidence to draw conclusions</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
        <span>GeneGuide MVP</span>
        <span>Education & self-observation — not medical advice</span>
      </footer>
    </div>
  );
}
