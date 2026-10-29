import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/LegalDoc";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Saving Solutions Group collects, uses, and protects your personal information, including text messaging, property data, and your privacy choices.",
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "October 29, 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    h: "Who we are",
    p: [
      `This Privacy Policy explains how Saving Solutions Group LLC and its affiliate Saving Solutions LLC (together, "Saving Solutions," "we," "us," or "our") collect, use, share, and protect information when you visit ${SITE.url.replace("https://", "")} (the "Site"), request a quote or service, or communicate with us by phone, text message, or email.`,
      `We are based in ${SITE.city}. Insurance products are offered only where we, or the insurers and agencies we work with, are properly licensed. By using the Site you agree to this policy. If you do not agree, please do not use the Site.`,
    ],
  },
  {
    id: "information-we-collect",
    h: "Information we collect",
    p: ["We collect only what we need to understand your request, prepare quotes, and serve you. This includes:"],
    list: [
      "Contact details: name, phone number, email address, mailing or property address, and your preferred way to be contacted.",
      "Insurance details you choose to share: the coverage you are interested in, business name and industry, current carrier and premium, desired effective date, and answers to underwriting questions (for example roof year, vehicles, drivers, or payroll).",
      "Property information: when you enter an address, we retrieve publicly available property records (such as property type, year built, square footage, assessed value, and flood zone) from county property appraiser and FEMA public databases so you can confirm them instead of typing them.",
      "Documents and requests: information you provide when asking for a certificate of insurance, ID card, policy change, or claim help.",
      "Device and usage data: browser type, pages viewed, referring website, and approximate location derived from your IP address, collected automatically through standard web technologies.",
      "Communications: records of calls, texts, and emails with our team, which help us serve you and meet our regulatory obligations.",
    ],
  },
  {
    id: "how-we-use",
    h: "How we use your information",
    list: [
      "To respond to your request, prepare and compare insurance quotes, and help you obtain, bind, service, and renew coverage.",
      "To share your information with insurance carriers, managing general agents, wholesale brokers, and market-access platforms as needed to obtain quotes and place coverage on your behalf.",
      "To contact you by phone, text message, or email about your request, your application, reminders about incomplete applications, and your policies.",
      "With your separate consent, to send you marketing and promotional messages, which you can opt out of at any time.",
      "To operate, secure, and improve the Site and our services, and to prevent fraud.",
      "To comply with applicable law, regulation, and insurance licensing requirements.",
    ],
  },
  {
    id: "sms",
    h: "Text messaging (SMS) and mobile information",
    p: [
      "If you provide your mobile number and consent, we may send you text messages related to your inquiry, application, quotes, policies, appointments, and service requests. Separately, and only with your additional consent, we may send marketing and promotional text messages. Consent to receive text messages is not a condition of purchasing any product or service.",
      "Message frequency varies. Message and data rates may apply. Reply STOP at any time to unsubscribe, or HELP for help.",
      "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Information sharing with subcontractors in support services, such as customer service and messaging platforms, is permitted. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.",
    ],
  },
  {
    id: "sharing",
    h: "How we share information",
    p: ["We do not sell your personal information. We share it only as follows:"],
    list: [
      "Insurance partners: carriers, MGAs, wholesale and specialty markets, and market-access platforms, to obtain quotes and place or service coverage you request.",
      "Service providers: companies that host our website, run our customer relationship management (CRM) and messaging systems, and provide e-signature, document, and communication tools. They may use your information only to perform services for us.",
      "Sustainability Alliance partners: only if you ask us to connect you with a vetted partner (for example, a roofing or leak-detection company), and only the details needed for that introduction.",
      "Legal and regulatory: when required by law, subpoena, or regulators, or to protect the rights, property, or safety of Saving Solutions, our clients, or others.",
      "Business transfers: in connection with a merger, acquisition, or sale of assets, subject to this policy.",
    ],
  },
  {
    id: "public-records",
    h: "Public property records",
    p: [
      "Our property lookup uses public records published by county property appraisers in Miami-Dade, Broward, and Palm Beach counties and flood-zone data from the Federal Emergency Management Agency (FEMA). These records are public and may contain errors or be out of date. We show them so you can confirm or correct them, and your advisor verifies all information before any quote. We do not display property owner names on the Site.",
    ],
  },
  {
    id: "cookies",
    h: "Cookies and similar technologies",
    p: [
      "The Site uses essential browser storage to remember an unfinished quote application on your device so you can resume it later; you can clear it at any time by clearing your browser data. We may also use analytics and advertising tools (for example, to measure which pages are useful or how visitors find us). You can control cookies through your browser settings. Blocking some cookies may affect how the Site works.",
    ],
  },
  {
    id: "security",
    h: "How we protect your information",
    p: [
      "We use reasonable administrative, technical, and physical safeguards designed to protect your information, including encrypted (HTTPS) connections to the Site. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. Please do not send Social Security numbers, bank or card numbers, or other highly sensitive information through website forms or text messages; your advisor will provide a secure way to share it if it is needed.",
    ],
  },
  {
    id: "retention",
    h: "How long we keep information",
    p: [
      "We keep information for as long as needed to provide our services, maintain your account and policy records, and meet legal, regulatory, tax, and insurance record-keeping requirements. When it is no longer needed, we delete or de-identify it.",
    ],
  },
  {
    id: "your-choices",
    h: "Your choices and rights",
    list: [
      "Text messages: reply STOP to opt out at any time.",
      "Email: use the unsubscribe link in any marketing email.",
      "Calls: ask us to place your number on our internal do-not-call list.",
      `Access, correction, and deletion: contact us at ${SITE.email} to request a copy of, correct, or delete your personal information, subject to legal and regulatory retention requirements.`,
    ],
    after: [
      "Depending on where you live, you may have additional rights under applicable state privacy laws. We will not discriminate against you for exercising any privacy right.",
    ],
  },
  {
    id: "children",
    h: "Children's privacy",
    p: [
      "The Site is intended for adults. We do not knowingly collect personal information from children under 13. If you believe a child has provided us information, contact us and we will delete it.",
    ],
  },
  {
    id: "links",
    h: "Third-party websites",
    p: [
      "The Site may link to websites or forms operated by others, including insurance carriers and our partners. Their privacy practices are governed by their own policies, and we are not responsible for them.",
    ],
  },
  {
    id: "changes",
    h: "Changes to this policy",
    p: [
      `We may update this Privacy Policy from time to time. The "Last updated" date at the top shows when it last changed. Material changes will be posted on this page.`,
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

export default function PrivacyPolicy() {
  return (
    <LegalDoc
      eyebrow="Legal · Privacy"
      title={<>Privacy <span className="italic text-gilded">Policy</span></>}
      intro="Your trust is the policy behind every policy. Here is exactly what we collect, why, and the choices you have."
      updated={UPDATED}
      sections={SECTIONS}
      other={{ href: "/terms-of-service", label: "Terms of Service" }}
    />
  );
}
