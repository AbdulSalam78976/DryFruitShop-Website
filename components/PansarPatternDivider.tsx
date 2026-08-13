export default function PansarPatternDivider() {
  return (
    <div
      className="relative -mt-8 z-30 flex h-16 w-full items-center justify-center bg-primary-container/20"
      style={{ maskImage: "radial-gradient(circle, black 40%, transparent 60%)", WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 60%)" }}
    >
      <svg className="h-full w-full text-secondary-fixed" xmlns="http://www.w3.org/2000/svg">
        <pattern id="pansar-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="4" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#pansar-pattern)" />
      </svg>
    </div>
  );
}
