import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import Script from "next/script";

const { NEXT_PUBLIC_ADSENSE_CLIENT } = SERVER_ENVIRONMENT;

export const AdsScript = () => {
  return (
    <Script
      async
      crossOrigin="anonymous"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${NEXT_PUBLIC_ADSENSE_CLIENT}`}
    />
  );
};
