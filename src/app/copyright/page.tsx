import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
export const metadata: Metadata = { title: "Copyright Policy" };
export default function Page() {
  return (
    <LegalPage
      title="Copyright Policy"
      updated="September 2026"
      sections={[
        { h: "Ownership", p: ["Dansvic Designs owns full copyright and all intellectual-property rights in every design, preview image and digital file published on this site. Downloading a file grants you a licence to use it as described below — it does not transfer ownership."] },
        { h: "What you CAN do", p: ["Embroider or print the design onto fabric and garments — for yourself, for clients, or for garments you sell — in unlimited quantities.", "Make minor adjustments needed for production, such as resizing within recommended limits, changing thread or ink colours, or trimming for placement."] },
        { h: "What you CANNOT do", p: ["Sell, rent, license or give away the digital design files, in original or converted formats.", "Redistribute the original files — including uploading them to other websites, groups, marketplaces, cloud folders or messaging apps.", "Claim the design as your own original artwork, or register it under your own name."] },
        { h: "Modification limits", p: ["Modification is allowed, with restrictions. Light edits for fit and colour are fine. Heavy modification or rebranding of a design in order to present it as the user’s own original work — for example, altering a motif and then publishing or selling it as your own design file — is not permitted."] },
        { h: "Preview images", p: ["Preview and mockup images on this site may be used to show clients what a design looks like, but may not be used to advertise the sale of the files themselves."] },
        { h: "Infringement & takedowns", p: ["If you believe a design infringes your rights, or you see our files being redistributed, email dansvicdesign@gmail.com with links and details. We act on verified reports promptly.", "[Placeholder — final wording to be confirmed with legal counsel.]"] },
      ]}
    />
  );
}
