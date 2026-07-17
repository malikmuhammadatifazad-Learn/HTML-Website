import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Marketing Analytics Dashboard",
  description: "Track your marketing campaigns in real-time",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider session={session}>
          <nav className="border-b px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <span className="text-xl font-bold">📊 Marketing Analytics</span>
              <div className="flex gap-4 text-sm">
                <a href="/" className="hover:underline">Dashboard</a>
                <a href="/campaigns" className="hover:underline">Campaigns</a>
                {session ? (
                  <a href="/api/auth/signout" className="hover:underline text-red-500">
                    Logout
                  </a>
                ) : (
                  <>
                    <a href="/login" className="hover:underline">Login</a>
                    <a href="/signup" className="hover:underline">Sign Up</a>
                  </>
                )}
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto p-6">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}