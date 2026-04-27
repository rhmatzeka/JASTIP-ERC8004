"use client";

import { ImageUp } from "lucide-react";

export default function UploadBox({
  label,
  value,
  onChange
}: {
  label: string;
  value?: string;
  onChange: (dataUrl: string) => void;
}) {
  return (
    <label className="block cursor-pointer rounded-lg border border-dashed border-line bg-cloud/70 p-4 transition hover:-translate-y-0.5 hover:border-ocean hover:bg-white">
      <input
        className="sr-only"
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onChange(String(reader.result));
          reader.readAsDataURL(file);
        }}
      />
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-ocean shadow-sm">
          <ImageUp size={20} />
        </span>
        <div className="min-w-0">
          <p className="font-black text-ink">{label}</p>
          <p className="text-sm text-muted">{value ? "Photo attached" : "Upload image for AI verification"}</p>
        </div>
      </div>
      {value ? <img src={value} alt={label} className="mt-4 h-40 w-full rounded-lg border border-line object-cover" /> : null}
    </label>
  );
}
