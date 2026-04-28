"use client";

import { useState } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  return (
    <label className="block w-full cursor-pointer rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] p-5 transition-all hover:border-accent/30 hover:bg-accent/[0.03] group">
      <input
        className="sr-only"
        type="file"
        accept="image/*"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setUploading(true);
          setError("");

          const form = new FormData();
          form.append("file", file);
          const response = await fetch("/api/uploads", {
            method: "POST",
            body: form
          });
          const data = await response.json();
          setUploading(false);

          if (!response.ok) {
            setError(data.error || "Upload failed");
            return;
          }
          onChange(data.url);
        }}
      />
      <div className="flex flex-col items-center justify-center text-center gap-2.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent transition-transform group-hover:scale-105">
          <ImageUp size={16} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="mt-1 text-[11px] text-muted">{uploading ? "Uploading..." : value ? "Photo attached" : "Click to upload image"}</p>
        </div>
      </div>
      {error ? <p className="mt-3 rounded-lg bg-danger/10 p-2.5 text-[11px] font-medium text-rose-300 text-center">{error}</p> : null}
      {value ? <img src={value} alt={label} className="mt-3 h-24 w-full rounded-lg border border-white/[0.06] object-cover" /> : null}
    </label>
  );
}
