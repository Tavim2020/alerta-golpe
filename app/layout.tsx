import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Anton, Public_Sans } from "next/font/google";
import type { Metadata } from "next";
import { SITE } from "@/lib/server";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--f-display",
});
const body = Public_Sans({ subsets: ["latin"], variable: "--f-body" });
const ads = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Alerta Golpe | Veja como os golpistas agem e não caia",
    template: "%s | Alerta Golpe",
  },
  description:
    "Vídeos reais de golpes sofridos por pessoas comuns. Entenda como os criminosos agem e proteja você e sua família.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Alerta Golpe" },
  ...(ads && { other: { "google-adsense-account": ads } }),
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="bg-paper font-body text-ink antialiased">
        <header className="bg-ink text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-2xl text-sun">
              Alerta Golpe
            </Link>
            <nav className="flex gap-5 text-sm font-semibold">
              <Link href="/" className="hover:text-sun">
                Início
              </Link>
              <Link href="/golpes" className="hover:text-sun">
                Golpes sofridos
              </Link>
            </nav>
          </div>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5256290346878469"
            crossOrigin="anonymous"
          ></script>
        </header>
        <main>{children}</main>
        <footer className="mt-16 bg-ink px-4 py-8 text-center text-sm text-white/70">
          <p>
            Os relatos são de pessoas reais. Foi vítima de golpe? Registre um
            boletim de ocorrência.
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Alerta Golpe</p>
        </footer>
        {ads && (
          <Script
            async
            crossOrigin="anonymous"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads}`}
          />
        )}
      </body>
    </html>
  );
}
