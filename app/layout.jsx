import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Margin — Research, connected",
  description: "The AI research workspace that turns reading into evidence-linked, citation-ready work.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><ClerkProvider>{children}</ClerkProvider></body>
    </html>
  );
}
