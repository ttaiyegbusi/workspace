import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { ToastHost } from "@/components/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workspace",
  description: "A clean, minimal workspace for teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="h-screen w-screen flex overflow-hidden bg-[var(--bg)] text-[var(--text)]">
            <Sidebar />
            <main className="flex-1 min-w-0 flex flex-col">{children}</main>
          </div>
          <ToastHost />
        </ThemeProvider>
      </body>
    </html>
  );
}
