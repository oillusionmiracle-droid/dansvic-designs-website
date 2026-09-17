import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { savedDesigns } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { browseDesigns } from "@/lib/catalog";
import { AccountShell } from "@/components/account/AccountShell";
import { DesignGrid } from "@/components/designs/DesignGrid";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/saved");
  const saved = await db.select({ id: savedDesigns.designId, at: savedDesigns.savedAt }).from(savedDesigns).where(eq(savedDesigns.userId, user.id)).orderBy(desc(savedDesigns.savedAt));
  const ids = saved.map((s) => s.id);
  const all = ids.length ? await browseDesigns({ limit: 500 }) : [];
  const list = all.filter((d) => ids.includes(d.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  void inArray;
  return (
    <AccountShell active="/account/saved" title="Saved Designs">
      <p className="text-ink-3 mb-6">Your wishlist and favourites, all in one place.</p>
      <DesignGrid designs={list} emptyMessage="Tap the ♡ on any design to save it here." />
    </AccountShell>
  );
}
