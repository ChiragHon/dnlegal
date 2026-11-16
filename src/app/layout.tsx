import type { Metadata, Viewport } from "next";
import { Lora, Inter, IBM_Plex_Mono } from "next/font/google";
import { ContentProvider } from "./context/ContentContext";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "D N Legal Associates | Best Legal Firm in Nashik, Maharashtra, India",
  description: "D N Legal Associates (DNL) — Nashik, Maharashtra based law firm specialising in Arbitration, Real Estate (RERA), Cyber Crime, Insolvency, Labour Law, Civil Litigation & more. Affiliated with Bar Council of Maharashtra & Goa. Call +91 93254 62134.",
  keywords: "law firm Nashik, advocate Nashik, DNL legal, arbitration Maharashtra, RERA complaint Nashik, cyber crime lawyer, insolvency lawyer, labour law advocate",
  authors: [{ name: "D N Legal Associates" }],
  openGraph: {
    title: "D N Legal Associates | Legal Firm in Nashik, Maharashtra",
    description: "Expert legal services across 10+ practice areas in Maharashtra. Arbitration, Real Estate, Cyber Law, Civil Litigation & more.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
