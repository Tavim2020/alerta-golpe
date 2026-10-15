'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function AdSlot() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  const on = client && slot;

  useEffect(() => {
    if (!on) return;
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }, [on]);

  if (!on) {
    return process.env.NODE_ENV === 'production' ? null : (
      <div className="my-8 grid h-24 place-items-center border border-dashed border-ink/30 text-sm text-ink/50">Espaço para anúncio</div>
    );
  }

  return (
    <div className="my-8 min-h-24 overflow-hidden text-center">
      <p className="mb-1 text-xs text-ink/40">Publicidade</p>
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  );
}
