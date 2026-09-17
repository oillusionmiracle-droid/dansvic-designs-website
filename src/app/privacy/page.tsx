import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 2026"
      sections={[
        { h: "What we collect", p: ["Account data: your name, email address and a securely hashed password.", "Activity data: designs you view, download, save, rate or report — used to power your Download History, Saved Designs and our featured-design rankings.", "Usage analytics: pages visited, referring source and approximate country, collected first-party to understand what designs and categories are popular. We may add Google Analytics in future and will update this policy if we do.", "Messages you send via the contact form or newsletter sign-up."] },
        { h: "How we use it", p: ["To provide downloads and keep your history so you can re-download any time; to secure download links to your account; to improve the catalogue; to respond to enquiries; and, if you subscribe, to email you about new designs. You can unsubscribe at any time."] },
        { h: "Cookies", p: ["We use a single essential session cookie to keep you signed in, and local storage to remember your light/dark theme preference and a random visitor identifier for analytics. No advertising cookies."] },
        { h: "Sharing", p: ["We do not sell your data. We share it only with service providers needed to run the site (hosting, database, email delivery) under confidentiality obligations, or where required by law."] },
        { h: "Retention & your rights", p: ["We keep account data while your account is active. You may request access to, correction of, or deletion of your data by emailing dansvicdesign@gmail.com. We comply with the Nigeria Data Protection Act and honour GDPR-style requests from international users.", "[Placeholder — final wording to be confirmed with legal counsel.]"] },
        { h: "Security", p: ["Passwords are hashed, download links are cryptographically signed and expire after 10 minutes, and design files are never exposed at public URLs."] },
        { h: "Contact", p: ["Dansvic Designs, Festac Town, Lagos, Nigeria · dansvicdesign@gmail.com"] },
      ]}
    />
  );
}
