import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";

export const metadata: Metadata = {
  title: "GeneGuide",
  description: "Genetic health education and personal reaction journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50">
            <DesktopNav />
            <main className="md:ml-64 pb-20 md:pb-0">
              {children}
            </main>
            <MobileNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}