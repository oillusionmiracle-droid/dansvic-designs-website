"use client";
import { useState } from "react";
import type { Design, DesignFile } from "@/db/schema";
import { EMBROIDERY_CATEGORIES, EMBROIDERY_FORMATS, PRINT_CATEGORIES, PRINT_FORMATS } from "@/lib/constants";
import { Field, input, textarea, btnPrimary, btnDanger, Card } from "@/components/admin/ui";
import { deleteDesign, deleteDesignFile, saveDesign } from "@/app/admin/actions";

export function DesignForm({ design, files, tags }: { design?: Design; files?: DesignFile[]; tags?: string[] }) {
  const [type, setType] = useState(design?.type ?? "embroidery");
  const cats = type === "embroidery" ? EMBROIDERY_CATEGORIES : PRINT_CATEGORIES;
  const formats = type === "embroidery" ? EMBROIDERY_FORMATS : PRINT_FORMATS;
  return (
    <form action={saveDesign} className="grid gap-5 lg:grid-cols-[1.3fr_1fr]" encType="multipart/form-data">
      {design && <input type="hidden" name="id" value={design.id} />}
      <div className="space-y-5">
        <Card className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
            <Field label="Name"><input name="name" required defaultValue={design?.name} className={input} /></Field>
            <Field label="Code"><input name="code" defaultValue={design?.code} placeholder="auto" readOnly={!!design} className={input} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type">
              <select name="type" value={type} onChange={(e) => setType(e.target.value)} className={input}>
                <option value="embroidery">Embroidery</option>
                <option value="print">Print</option>
              </select>
            </Field>
            <Field label="Category">
              <select name="category" defaultValue={design?.category ?? cats[0]} className={input}>
                {cats.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description"><textarea name="description" rows={5} defaultValue={design?.description} className={textarea} /></Field>
          <Field label="Tags (comma separated)"><input name="tags" defaultValue={tags?.join(", ")} placeholder="agbada, neckline, floral" className={input} /></Field>
          {type === "embroidery" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Dimensions"><input name="dimensions" defaultValue={design?.dimensions ?? ""} placeholder="180 × 120 mm" className={input} /></Field>
              <Field label="Stitch count"><input name="stitchCount" type="number" defaultValue={design?.stitchCount ?? ""} className={input} /></Field>
              <Field label="Colours"><input name="colourCount" type="number" defaultValue={design?.colourCount ?? ""} className={input} /></Field>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Software compatibility"><input name="softwareCompatibility" defaultValue={design?.softwareCompatibility ?? ""} placeholder="CorelDRAW X7+, Illustrator, Inkscape" className={input} /></Field>
              <Field label="Dimensions"><input name="dimensions" defaultValue={design?.dimensions ?? ""} placeholder="A3 / scalable vector" className={input} /></Field>
            </div>
          )}
        </Card>
        <Card className="space-y-3">
          <h2 className="font-bold">Design files (private storage)</h2>
          <p className="text-sm text-ink-3">Uploads replace the existing file for that format. Files are served only via signed, expiring links.</p>
          {formats.map((f) => {
            const existing = files?.find((x) => x.fileFormat === f);
            return (
              <div key={f} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
                <span className="w-12 font-bold">{f}</span>
                <input type="file" name={`file_${f}`} className="text-sm flex-1 min-w-[200px]" />
                {existing && (
                  <span className="text-xs text-ink-3 inline-flex items-center gap-2">
                    {Math.round(existing.fileSize / 1000)} KB uploaded
                    <button type="button" formNoValidate onClick={() => deleteDesignFile(existing.id)} className="text-red-600 font-semibold">remove</button>
                  </span>
                )}
              </div>
            );
          })}
        </Card>
      </div>
      <div className="space-y-5">
        <Card className="space-y-4">
          <h2 className="font-bold">Preview images</h2>
          <Field label="Primary preview (upload)"><input type="file" name="preview" accept="image/*" className="mt-1 block text-sm" /></Field>
          <Field label="…or image URL"><input name="preview_url" defaultValue={design?.previewImageUrl ?? ""} className={input} /></Field>
          <Field label="Secondary preview (upload, optional)"><input type="file" name="secondary" accept="image/*" className="mt-1 block text-sm" /></Field>
          <Field label="…or image URL"><input name="secondary_url" defaultValue={design?.secondaryPreviewUrl ?? ""} className={input} /></Field>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-bold">Visibility</h2>
          {[
            ["isPublished", "Published", design ? design.isPublished : true],
            ["isFeatured", "Featured", design?.isFeatured ?? false],
            ["isFree", "Free download", design ? design.isFree : true],
          ].map(([name, label, def]) => (
            <label key={String(name)} className="flex items-center gap-3 text-[15px]">
              <input type="checkbox" name={String(name)} defaultChecked={Boolean(def)} className="h-5 w-5 accent-[var(--accent)]" />
              {label}
            </label>
          ))}
        </Card>
        <div className="flex items-center justify-between">
          <button type="submit" className={btnPrimary}>{design ? "Save changes" : "Create design"}</button>
          {design && (
            <button type="button" className={btnDanger} onClick={() => confirm("Delete this design permanently?") && deleteDesign(design.id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
