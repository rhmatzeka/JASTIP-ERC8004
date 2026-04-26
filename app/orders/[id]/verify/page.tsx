"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, ScanLine } from "lucide-react";
import UploadBox from "@/components/UploadBox";

export default function VerifyOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState({
    receiptPhotoUrl: "",
    itemPhotoUrl: "",
    additionalItemPhotoUrl: ""
  });

  async function submit() {
    setLoading(true);
    await fetch(`/api/orders/${params.id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photos)
    });
    setLoading(false);
    router.push(`/orders/${params.id}`);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-ocean">AI receipt and item check</p>
        <h1 className="mt-1 text-3xl font-black text-ink">Upload Bukti Pembelian</h1>
      </div>
      <section className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <UploadBox
            label="Receipt photo"
            value={photos.receiptPhotoUrl}
            onChange={(receiptPhotoUrl) => setPhotos({ ...photos, receiptPhotoUrl })}
          />
          <UploadBox
            label="Item photo with receipt"
            value={photos.itemPhotoUrl}
            onChange={(itemPhotoUrl) => setPhotos({ ...photos, itemPhotoUrl })}
          />
          <div className="md:col-span-2">
            <UploadBox
              label="Additional item photo"
              value={photos.additionalItemPhotoUrl}
              onChange={(additionalItemPhotoUrl) => setPhotos({ ...photos, additionalItemPhotoUrl })}
            />
          </div>
        </div>
        <button className="btn-primary mt-6" onClick={submit} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : <ScanLine size={16} />}
          Run AI Verification
        </button>
      </section>
    </main>
  );
}
