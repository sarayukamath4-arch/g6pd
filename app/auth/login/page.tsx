import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                G
              </div>
              <span className="text-2xl font-bold text-slate-900">GeneGuide</span>
            </div>
          </Link>
          <p className="text-slate-600">Personal health intelligence</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}