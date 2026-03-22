import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
const fontStack = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const metadata: Metadata = {
  title: "GEO Insights Platform",
  description: "Monitor LLM recommendations and Share of Voice for your brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="h-full antialiased dark"
        style={{ fontFamily: fontStack }}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
