import Image from "next/image";
import Link from "next/link";
import { listProducts } from "@/lib/db";
import PansarPatternDivider from "@/components/PansarPatternDivider";
import FeatureTile from "@/components/FeatureTile";

// Stock/prices change constantly via the POS -- render per-request instead
// of baking in a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listProducts().catch(() => []);
  const featured = products.slice(0, 3);
  const [main, ...rest] = featured;

  return (
    <div className="relative flex w-full flex-col">
      {/* Hero -- drop a photo at public/hero-valley.jpg to fill the background;
          the emerald gradient alone is a perfectly fine fallback until then. */}
      <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 lg:px-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-primary"
          style={{ backgroundImage: "url('/hero-valley.jpg')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/30" />
        <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
          <Image
            src="/logo.png"
            alt="Swat Nayab Logo"
            width={160}
            height={160}
            className="h-32 w-32 rounded-full bg-surface-container-lowest/10 object-contain p-2 shadow-xl backdrop-blur-sm md:h-48 md:w-48"
          />
          <h1 className="font-serif text-on-primary text-[2.5rem] leading-tight drop-shadow-lg md:text-[4rem]">
            The Purest Dry Fruits, <br className="hidden md:block" />
            <span dir="rtl" className="font-nastaliq mt-2 block text-[3rem] leading-snug text-secondary-fixed opacity-90 md:text-[5rem]">
              قدرت کی وادی سے آپ کے دروازے تک
            </span>
          </h1>
          <p className="max-w-2xl text-lg font-light tracking-wide text-surface-container-low drop-shadow-md md:text-xl">
            Experience the authentic taste of the East with our premium selection of organic dry fruits and
            heritage pansar treasures, directly sourced from the emerald mountains of Swat.
          </p>
          <Link
            href="/shop"
            className="group relative mt-8 flex items-center gap-3 overflow-hidden rounded-sm border border-secondary-fixed/50 bg-primary px-10 py-4 text-sm font-semibold tracking-wider text-secondary-fixed uppercase shadow-md transition-all duration-500 hover:scale-105 hover:bg-secondary-fixed hover:text-primary"
          >
            <span className="relative z-10">Shop Our Fresh Collection</span>
            <span className="material-symbols-outlined relative z-10 text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
      </div>

      <PansarPatternDivider />

      {/* Featured products */}
      <section className="relative z-10 bg-background px-4 py-20 lg:px-12">
        <div className="mx-auto max-w-[1280px] space-y-16">
          <div className="flex flex-col items-center space-y-4 text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase">Premium Selection</span>
            <h2 className="font-serif text-3xl text-primary md:text-4xl">Heritage Harvests</h2>
            <div className="h-px w-16 bg-secondary-fixed-dim" />
          </div>

          {main ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
              <FeatureTile product={main} large />
              {rest.length > 0 && (
                <div className="flex flex-col gap-8 md:col-span-5 md:gap-12">
                  {rest.map((p) => (
                    <FeatureTile key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-on-surface-variant">Products are being added — check back soon.</p>
          )}

          <div className="mt-12 flex justify-center">
            <Link href="/shop" className="flex items-center gap-2 border-b border-secondary-fixed px-8 py-3 text-sm font-semibold tracking-wider text-primary transition-colors hover:text-secondary-fixed">
              View Complete Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage story -- drop a photo at public/heritage-farmer.jpg */}
      <section className="relative flex items-center overflow-hidden bg-surface-container py-20">
        <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:px-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-secondary-fixed-dim uppercase">
                <span className="inline-block h-px w-8 bg-secondary-fixed-dim" />
                Our Heritage
              </span>
              <h2 className="font-serif text-4xl leading-tight text-primary md:text-5xl">
                Rooted in the <br /> <span className="font-light text-secondary-fixed-dim italic">Swiss of the East</span>
              </h2>
            </div>
            <p className="max-w-lg text-lg leading-relaxed text-on-surface-variant">
              For generations, our family has cultivated the rich soils of the Swat Valley. We believe that true
              quality cannot be rushed. Our dry fruits are sun-dried using ancient Pansar traditions, ensuring
              that every almond, walnut, and fig retains its natural oils and potent nutritional profile.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <span className="font-serif text-4xl text-primary">
                  100<span className="text-secondary-fixed-dim">%</span>
                </span>
                <p className="text-xs tracking-wider text-on-surface-variant uppercase">Organic Certified</p>
              </div>
              <div className="space-y-2">
                <span className="font-serif text-4xl text-primary">
                  0<span className="text-secondary-fixed-dim">km</span>
                </span>
                <p className="text-xs tracking-wider text-on-surface-variant uppercase">Farm to Packaging</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="relative z-10 aspect-[4/5] overflow-hidden rounded-t-full rounded-bl-full bg-cover bg-center bg-surface shadow-xl"
              style={{ backgroundImage: "url('/heritage-farmer.jpg')" }}
            />
            <div className="absolute -right-8 -bottom-8 z-20 flex h-48 w-48 flex-col items-center justify-center rounded-full bg-primary p-6 text-center shadow-lg">
              <Image src="/logo.png" alt="" width={96} height={96} className="h-24 w-24 object-contain opacity-80 brightness-0 invert" />
              <span className="font-nastaliq mt-2 text-lg text-secondary-fixed">خالص روایت</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
