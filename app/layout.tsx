import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Trading App",
  description: "AI-powered trading application with TradingView charts and market analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <header className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-blue-400">AI Trading App</h1>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
