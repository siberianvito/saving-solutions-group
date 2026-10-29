"use client";

import { useEffect } from "react";

/**
 * GoHighLevel inline form (leads land straight in GHL).
 * The inside of the iframe is skinned by assets/ghl-form-custom.css, pasted
 * into GHL → Sites → Forms → Styles → Custom CSS. Its canvas is transparent,
 * so the luxury frame around it shows through.
 */
export const GHL_FORM_URL = "https://api.leadconnectorhq.com/widget/form/gRFLaOj2R0Wmm1KEGLMv";

export default function GHLForm({ idSuffix = "", title = "Request a quote" }: { idSuffix?: string; title?: string }) {
  useEffect(() => {
    // GHL's resizer: auto-fits the iframe height to the form
    if (document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]')) return;
    const s = document.createElement("script");
    s.src = "https://link.msgsndr.com/js/form_embed.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const formId = GHL_FORM_URL.split("/").pop();

  return (
    <iframe
      src={GHL_FORM_URL}
      id={`inline-${formId}${idSuffix ? `-${idSuffix}` : ""}`}
      title={`${title}: Saving Solutions Group`}
      className="block w-full border-0 bg-transparent"
      style={{ minHeight: 640, colorScheme: "normal" }}
      allow="clipboard-write"
      data-layout="{'id':'INLINE'}"
      data-trigger-type="alwaysShow"
      data-activation-type="alwaysActivated"
      data-deactivation-type="neverDeactivate"
      data-form-name="Saving Solutions Group: Quote Request"
    />
  );
}
