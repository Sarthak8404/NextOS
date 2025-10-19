import { Providers } from "./components/Providers";
import type { Metadata } from "next";
import { Navbar } from "./components/navbar";
import "./globals.css";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { GridBackgroundDemo } from "@/components/ui/grid-backgroundDemo";
export const metadata: Metadata = {
  title: "NextOS",
  description:
    "A platform where developers can upload their tools or projects, and LLMs can access and use them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="relative min-h-screen w-full font-sans antialiased">
        {/* Background always behind everything - FULLSCREEN */}
        <div className="fixed inset-0 -z-10 h-screen w-screen">
          <GridBackgroundDemo />
        </div>

        <Providers>
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}