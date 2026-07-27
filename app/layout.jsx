import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "TheMagin — Research, connected",
  applicationName: "TheMagin",
  description: "The AI research workspace that turns reading into evidence-linked, citation-ready work.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><ClerkProvider>{children}</ClerkProvider></body>
    </html>
  );
}
