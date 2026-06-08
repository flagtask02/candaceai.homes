import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candace AI — Intelligence, trained in your home",
  description:
    "A private technology. Seven days. One system. Yours to keep. Request access to the 2026 cohort.",
  openGraph: {
    title: "Candace AI",
    description: "Intelligence, trained in your home.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-[#080808] text-[#e8e8e8] antialiased">
        {children}
        <Script id="smartsupp" strategy="afterInteractive">{`
          var _smartsupp = _smartsupp || {};
          _smartsupp.key = '7d3e10ae18d17d18ad8a97687f70e1d2272eab95';
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
        `}</Script>
      </body>
    </html>
  );
}
