import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
export const metadata: Metadata = { title: "Terms & Conditions" };
export default function Page() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="September 2026"
      sections={[
        { h: "Acceptance of terms", p: ["By creating an account or downloading any file from Dansvic Designs (\"we\", \"us\"), you agree to these Terms & Conditions, our Privacy Policy and our Copyright Policy. If you do not agree, please do not use the site."] },
        { h: "Accounts", p: ["You must create an account to download designs. You are responsible for keeping your password secure and for all activity under your account. We may suspend or disable accounts that breach these terms, including sharing or reselling files.", "Provide accurate information. One person per account."] },
        { h: "Free designs & downloads", p: ["All designs are currently offered free of charge with no download limits. You may re-download files from your Download History at any time. Download links are personal, time-limited and must not be shared.", "We may introduce paid designs, memberships or custom services in future; any such change will be clearly labelled before you commit to anything."] },
        { h: "Permitted use", p: ["Downloaded designs may be used to embroider or print onto fabric and garments, for personal or client work, in unlimited quantities.", "You may NOT resell, license, share, upload or otherwise redistribute the digital design files (EMB, DST, DSB, CDR, PDF or any derivative digital file) in any form, free or paid.", "You may make minor modifications (resizing, colour changes, small edits) for your production needs. Heavy modification or rebranding of a design in order to present it as your own original work is not permitted. See the Copyright Policy for details."] },
        { h: "Reviews, ratings and reports", p: ["Reviews must be honest and relate to your own experience. We may remove reviews that are abusive, off-topic or misleading. Reports of download or file problems are used to fix issues and may be shared internally."] },
        { h: "Availability", p: ["We aim to keep the site available at all times but do not guarantee uninterrupted access. Designs may be updated, unpublished or replaced without notice."] },
        { h: "Disclaimer & liability", p: ["Files are provided \"as is\". Stitch-out results depend on your machine, stabiliser, fabric and thread. To the fullest extent permitted by law, Dansvic Designs is not liable for any loss arising from use of the site or files.", "[Placeholder — final wording to be confirmed with legal counsel.]"] },
        { h: "Governing law & contact", p: ["These terms are governed by the laws of the Federal Republic of Nigeria. Questions: dansvicdesign@gmail.com."] },
      ]}
    />
  );
}
