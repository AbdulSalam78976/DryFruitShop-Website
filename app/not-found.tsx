import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="material-symbols-outlined text-6xl text-green-deep/40">nutrition</span>
      <div className="space-y-2">
        <h1 className="text-4xl">Page not found</h1>
        <p className="text-ink/60">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
      </div>
      <Link
        href="/shop"
        className="rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold tracking-wide text-green-deep uppercase shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Browse the Collection
      </Link>
    </div>
  );
}
