import { getSettings } from "@/lib/db";
import { toWhatsAppNumber } from "@/lib/whatsapp";

export default async function FloatingWhatsApp() {
  const settings = await getSettings().catch(() => null);
  if (!settings?.whatsapp_handle) return null;

  const message = encodeURIComponent("Hi! I have a question about your products.");
  const href = `https://wa.me/${toWhatsAppNumber(settings.whatsapp_handle)}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.001 2.667c-7.363 0-13.334 5.97-13.334 13.333 0 2.353.615 4.66 1.782 6.687L2.7 29.333l6.82-1.716a13.28 13.28 0 0 0 6.48 1.65h.006c7.362 0 13.333-5.97 13.333-13.334 0-3.56-1.387-6.907-3.905-9.425a13.24 13.24 0 0 0-9.433-3.841zm0 24.4h-.005a11.07 11.07 0 0 1-5.636-1.543l-.404-.24-4.048 1.018 1.08-3.944-.263-.405a11.05 11.05 0 0 1-1.696-5.897c0-6.112 4.976-11.087 11.09-11.087a11.02 11.02 0 0 1 7.842 3.253 11.02 11.02 0 0 1 3.245 7.844c0 6.113-4.977 11.001-11.204 11.001zm6.083-8.27c-.334-.167-1.97-.972-2.275-1.083-.305-.111-.527-.167-.75.167-.222.334-.86 1.083-1.055 1.305-.194.223-.389.25-.722.084-.334-.167-1.408-.519-2.682-1.654-.992-.884-1.662-1.977-1.856-2.31-.194-.334-.02-.514.146-.68.15-.15.334-.39.5-.585.167-.194.223-.334.334-.556.111-.223.056-.417-.028-.584-.083-.167-.75-1.807-1.027-2.474-.27-.65-.545-.562-.75-.572l-.638-.012c-.222 0-.583.084-.888.417s-1.166 1.14-1.166 2.78 1.194 3.226 1.361 3.448c.167.223 2.35 3.587 5.693 5.03.795.343 1.415.548 1.898.7.797.254 1.523.218 2.097.132.64-.095 1.97-.805 2.247-1.583.278-.778.278-1.445.194-1.584-.083-.14-.305-.222-.639-.389z" />
      </svg>
    </a>
  );
}
