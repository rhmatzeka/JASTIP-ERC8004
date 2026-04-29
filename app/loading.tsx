import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid min-h-[calc(100vh-88px)] place-items-center px-5">
      <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-black/45 px-5 py-3 text-sm font-semibold text-white shadow-elevated backdrop-blur-md">
        <LoaderCircle className="animate-spin text-accent" size={18} />
        Loading page
      </div>
    </main>
  );
}
