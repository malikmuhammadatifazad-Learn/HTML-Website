import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketing Analytics Dashboard",
  description: "Track your marketing campaigns in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="border-b px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="text-xl font-bold">📊 Marketing Analytics</span>
            <div className="flex gap-4 text-sm">
              <a href="/" className="hover:underline">Dashboard</a>
              <a href="/campaigns" className="hover:underline">Campaigns</a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}