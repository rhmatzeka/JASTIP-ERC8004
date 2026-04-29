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
    <label className="block w-full cursor-pointer rounded-xl border border-dashed border-white/[0.08] bg-[#060606] p-5 transition-all hover:border-[#d4ff00]/20 hover:bg-[#0a0a0a] group">
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
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.03] text-[#888] transition-all group-hover:text-[#d4ff00] group-hover:bg-[#d4ff00]/10">
          <ImageUp size={16} strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-white">{label}</p>
          <p className="mt-1 text-[11px] text-[#666]">{uploading ? "Uploading..." : value ? "Photo attached" : "Click to upload image"}</p>
        </div>
      </div>
      {error ? <p className="mt-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/15 p-2.5 text-[11px] font-medium text-[#f87171] text-center">{error}</p> : null}
      {value ? <img src={value} alt={label} className="mt-3 h-24 w-full rounded-lg border border-white/[0.05] object-cover" /> : null}
    </label>
  );
}
