"use client";

import { useEffect, useRef } from "react";
import { EmptyAds } from "./components/empty-ads";
import { CLIENT_ENVIRONMENT } from "@/environments/client.environment";
import { AdsSlotProps } from "./ads-slot.type";
import { isProduction } from "@/constants/env.constant";

const { NEXT_PUBLIC_ADSENSE_CLIENT } = CLIENT_ENVIRONMENT;

export const AdsSlot = ({ slotNumber }: AdsSlotProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!slotNumber || initialized.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initialized.current = true;
    } catch (err) {
      console.error(err);
    }
  }, [slotNumber]);

  if (!slotNumber) return isProduction ? null : <EmptyAds />;

  return (
    <div className="my-8 min-h-24 overflow-hidden text-center">
      <p className="mb-1 text-xs text-ink/40 border-b border-gray-500 pb-2">
        Publicidade
      </p>

      <ins
        className="adsbygoogle"
        style={{ display: "block", borderStyle: "dashed" }}
        data-ad-client={NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slotNumber}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
