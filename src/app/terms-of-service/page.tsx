import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/LegalDoc";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Saving Solutions Group website, quote tools, and text messaging program, including SMS opt-out (STOP) and help (HELP) instructions.",
  alternates: { canonical: "/terms-of-service" },
};

const UPDATED = "October 29, 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    h: "Acceptance of these terms",
    p: [
      `These Terms of Service ("Terms") govern your use of ${SITE.url.replace("https://", "")} (the "Site") and the services offered through it by Saving Solutions Group LLC and its affiliate Saving Solutions LLC ("Saving Solutions," "we," "us," or "our"). By using the Site, submitting a form, or enrolling in our text messaging program, you agree to these Terms and to our Privacy Policy.`,
    ],
  },
  {
    id: "services",
    h: "Our services",
    p: [
      "Saving Solutions provides insurance and risk-management services, including help obtaining property and casualty, private client, life and financial, and related coverage, as well as water conservation and property solutions. Insurance products are offered only in states and for lines where we, or the licensed agencies and insurers we work with, are authorized to do business. Some services described on the Site may be offered through partner agencies or may not yet be available in every location.",
    ],
  },
  {
    id: "no-binding",
    h: "Quotes are not coverage",
    p: [
      "Submitting a quote request, application, or any information through the Site does not create, bind, or change insurance coverage. Coverage begins only when an insurer accepts your application, the policy is issued, and any required premium is paid, and only on the terms of the issued policy. Quotes, estimates, and premium examples shown on the Site are illustrations, are subject to underwriting and insurer approval, and may change.",
      "Do not cancel any existing policy until you have written confirmation that new coverage is in force.",
    ],
  },
  {
    id: "your-info",
    h: "Information you provide",
    p: [
      "You agree that information you provide is accurate and complete to the best of your knowledge. Insurers rely on it to price and issue coverage, and inaccurate or incomplete information can lead to a denied claim or a cancelled or rescinded policy. You authorize us to share your information with insurers and partners as described in our Privacy Policy to obtain quotes and place coverage.",
    ],
  },
  {
    id: "property-data",
    h: "Property information from public records",
    p: [
      "Property details shown by our address lookup come from public records published by county property appraisers and FEMA flood maps. They are provided for convenience, may be incomplete, inaccurate, or outdated, and are not an appraisal, inspection, flood determination, or guarantee of insurability or price. Your advisor and the insurer will confirm all property information before any coverage is offered.",
    ],
  },
  {
    id: "sms-program",
    h: "Text messaging (SMS) program",
    p: [
      "By providing your mobile number and checking the consent box on our forms, you agree to receive text messages from Saving Solutions Group LLC about your inquiry, application, quotes, policies, appointments, and service requests. If you also check the separate marketing consent box, you agree to receive marketing and promotional messages, such as special offers and updates, from Saving Solutions LLC. Consent is not a condition of any purchase.",
    ],
    list: [
      "Message frequency varies based on your requests and account activity.",
      "Message and data rates may apply, depending on your mobile carrier and plan.",
      `To stop receiving messages, reply STOP to any message. You will receive one final message confirming you have been unsubscribed, and no further messages will be sent. To rejoin, sign up again as you did originally.`,
      `For help, reply HELP to any message, email ${SITE.email}, or call ${SITE.phone}.`,
      "Carriers are not liable for delayed or undelivered messages.",
      "Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes. See our Privacy Policy for details.",
    ],
  },
  {
    id: "communications",
    h: "Calls and emails",
    p: [
      "By submitting a request, you agree that we may contact you at the phone number and email address you provide, including by calls and messages that may be made using automated technology, about your request. You can ask us to stop contacting you at any time.",
    ],
  },
  {
    id: "site-use",
    h: "Acceptable use",
    p: ["You agree not to:"],
    list: [
      "Use the Site for any unlawful, fraudulent, or misleading purpose, or submit information about another person without their authorization.",
      "Attempt to access accounts, systems, or data you are not authorized to access, or interfere with the Site's operation or security.",
      "Scrape, copy, or republish Site content or data in bulk, or use automated tools to submit forms.",
    ],
  },
  {
    id: "ip",
    h: "Intellectual property",
    p: [
      "The Site, including its design, text, graphics, logos, and software, is owned by Saving Solutions or its licensors and is protected by copyright and trademark law. You may view the Site for your personal, non-commercial use. Public records and third-party data remain the property of their respective publishers.",
    ],
  },
  {
    id: "third-parties",
    h: "Third-party services and links",
    p: [
      "The Site may use or link to services operated by others, such as insurers, embedded forms, messaging platforms, and public data sources. We are not responsible for their content, availability, or practices, and your use of them may be subject to their own terms.",
    ],
  },
  {
    id: "disclaimers",
    h: "Disclaimers",
    p: [
      `The Site and its content are provided "as is" and "as available." Content is for general information only and is not legal, tax, or financial advice; coverage is governed solely by the terms of the policy issued. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. Water savings figures reflect past client results and do not guarantee future savings.`,
    ],
  },
  {
    id: "liability",
    h: "Limitation of liability",
    p: [
      "To the fullest extent permitted by law, Saving Solutions will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data or profits, arising from your use of the Site. Nothing in these Terms limits any liability that cannot be limited under applicable law, including our obligations as a licensed insurance agency.",
    ],
  },
  {
    id: "law",
    h: "Governing law",
    p: [
      "These Terms are governed by the laws of the State of Florida, without regard to its conflict-of-law rules. Any dispute will be resolved in the state or federal courts located in Miami-Dade County, Florida, and you consent to their jurisdiction.",
    ],
  },
  {
    id: "changes",
    h: "Changes to these terms",
    p: [
      `We may update these Terms from time to time. The "Last updated" date shows when they last changed, and continued use of the Site means you accept the updated Terms.`,
    ],
  },
  {
    id: "contact",
    h: "Contact us",
    p: [
      `Saving Solutions Group LLC · ${SITE.city}`,
      `Email: ${SITE.email} · Phone: ${SITE.phone} · Office: ${SITE.office}`,
    ],
  },
];

export default function TermsOfService() {
  return (
    <LegalDoc
      eyebrow="Legal · Terms"
      title={<>Terms of <span className="italic text-gilded">Service</span></>}
      intro="The ground rules for using our website, quote tools, and text messaging program. Plain language wherever we could."
      updated={UPDATED}
      sections={SECTIONS}
      other={{ href: "/privacy-policy", label: "Privacy Policy" }}
    />
  );
}
