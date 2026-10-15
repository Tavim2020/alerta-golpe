"use client";

import React, { useEffect, useRef } from "react";

const ads = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const TesteAds = () => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ad = adRef.current;

    if (!ad || ad.dataset.adInitialized) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      ad.dataset.adInitialized = "true";
    } catch (error) {
      console.error("Erro ao carregar o Google AdSense:", error);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={ads}
      data-ad-slot="2944582241"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};
