export const SITE = {
  name: "Dansvic Designs",
  tagline: "Embroidery & print designs that tell your story",
  email: "dansvicdesign@gmail.com",
  phone: "+2349015886855",
  phoneDisplay: "+234 901 588 6855",
  whatsapp: "https://wa.me/2349015886855",
  address: "Festac Town, Lagos, Nigeria",
  socials: {
    instagram: "https://instagram.com/dansvicdesigns",
    facebook: "https://facebook.com/dansvicdesigns",
    tiktok: "https://tiktok.com/@dansvicdesigns",
    pinterest: "https://pinterest.com/dansvicdesigns",
  },
};

export const EMBROIDERY_CATEGORIES = ["Agbada", "Flap & Pocket", "Danshiki", "Aso-Oke", "Caps", "T-Shirts"] as const;
export const PRINT_CATEGORIES = ["Cap", "T-shirt", "Trouser"] as const;
export const EMBROIDERY_FORMATS = ["EMB", "DST", "DSB"] as const;
export const PRINT_FORMATS = ["CDR", "PDF"] as const;
export const ALL_FORMATS = [...EMBROIDERY_FORMATS, ...PRINT_FORMATS];

export const CATEGORY_IMAGES: Record<string, string> = {
  Agbada: "/images/designs/agbada.jpg",
  "Flap & Pocket": "/images/designs/flap.jpg",
  Danshiki: "/images/designs/danshiki.jpg",
  "Aso-Oke": "/images/designs/asooke.jpg",
  Caps: "/images/designs/cap.jpg",
  "T-Shirts": "/images/designs/tshirt.jpg",
  Cap: "/images/designs/print-cap.jpg",
  "T-shirt": "/images/designs/print-tee.jpg",
  Trouser: "/images/designs/print-trouser.jpg",
};

export const INQUIRY_TYPES = [
  { value: "general", label: "General Enquiries" },
  { value: "download", label: "Download Problems" },
  { value: "technical", label: "Technical Support" },
  { value: "other", label: "Other" },
] as const;

export const REPORT_REASONS = [
  { value: "download_problem", label: "Download problem" },
  { value: "file_issue", label: "File issue (corrupt / wrong format)" },
  { value: "other", label: "Other" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "downloads", label: "Most Downloaded" },
  { value: "popular", label: "Most Popular" },
] as const;

export function slugifyCategory(c: string) {
  return c.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
export function categoryFromSlug(slug: string) {
  const all = [...EMBROIDERY_CATEGORIES, ...PRINT_CATEGORIES];
  return all.find((c) => slugifyCategory(c) === slug) ?? null;
}
