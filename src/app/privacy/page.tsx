import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      sections={[
        { h: "What we collect", p: ["Account data: your name, email address and a securely hashed password.", "Activity data: designs you view, download, save, rate or report — used to power your Download History, Saved Designs and our featured-design rankings.", "With your permission, first-party analytics collects pages visited, the referring website origin, a random visitor identifier and approximate country. Abuse prevention uses a keyed hash of your network address to apply request limits; it does not store your raw address in the rate-limit table.", "Messages you send via the contact form or newsletter sign-up."] },
        { h: "How we use it", p: ["To provide downloads and keep your history so you can re-download any time; to secure download links to your account; to improve the catalogue; to respond to enquiries; and, if you subscribe, to email you about new designs. You can unsubscribe at any time."] },
        { h: "Cookies", p: ["We use an essential session cookie to keep you signed in and local storage to remember your theme and privacy choice. Optional first-party analytics runs only if you allow it. You can change your choice from the footer. We do not use advertising cookies."] },
        { h: "Sharing", p: ["We do not sell your data. We share it only with service providers needed to run the site (hosting, database, email delivery) under confidentiality obligations, or where required by law."] },
        { h: "Retention & your rights", p: ["We keep account data while your account is active. You may request access to, correction of, or deletion of your data by emailing dansvicdesign@gmail.com.", "Expired recovery tokens and abuse-prevention records are removed during routine maintenance. Contact us if you wish to close your account or change your newsletter preferences."] },
        { h: "Security", p: ["Passwords are hashed, download links are cryptographically signed and expire after 10 minutes, and design files are never exposed at public URLs."] },
        { h: "Contact", p: ["Dansvic Designs, Festac Town, Lagos, Nigeria · dansvicdesign@gmail.com"] },
      ]}
    />
  );
}
