import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { fontAnton, fontPublicSans } from "@/fonts/global.font";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import type { RootLayoutProps } from "@/types/global.type";
import { AdsScript } from "@/libs/ads/scripts";
import { APP_INFO } from "@/constants/app.constant";
import { ToastContainer } from "@/libs/react-toastify/components/toast-container";

import "./globals.css";
import { QueryProvider } from "@/libs/react-query/contexts/query-provider";

const { NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_ADSENSE_CLIENT } = SERVER_ENVIRONMENT;

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${APP_INFO.name} | Veja como os golpistas agem e não caia`,
    template: `${APP_INFO.name} | %s`,
  },
  description:
    "Vídeos reais de golpes sofridos por pessoas comuns. Entenda como os criminosos agem e proteja você e sua família.",
  openGraph: { type: "website", locale: "pt_BR", siteName: APP_INFO.name },
  other: { "google-adsense-account": NEXT_PUBLIC_ADSENSE_CLIENT },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-BR"
      className={`${fontAnton.variable} ${fontPublicSans.variable}`}
    >
      <body className="bg-paper min-h-dvh font-body flex flex-col text-ink antialiased min-w-85">
        <QueryProvider>
          <Header />
          <ToastContainer />
          <main>{children}</main>
          <Footer />

          <AdsScript />
        </QueryProvider>
      </body>
    </html>
  );
}
