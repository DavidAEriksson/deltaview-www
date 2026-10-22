"use client";

/** The hero's recorded run: autoplays muted, or waits with controls when the viewer prefers reduced motion. */
export function DemoVideo() {
  return (
    <video
      ref={(el) => {
        if (!el) return;
        el.muted = true; // React doesn't reliably render the muted attribute, and autoplay needs it
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          el.pause();
          el.controls = true;
        } else {
          el.play().catch(() => {});
        }
      }}
      muted
      loop
      playsInline
      preload="auto"
      poster="/demo-poster.png"
      aria-label="Deltaview reviewing a checkout branch: one item rejected with a reason, four approved, then Finish review"
      className="block size-full object-cover"
    >
      <source src="/demo.webm" type="video/webm" />
      <source src="/demo.mp4" type="video/mp4" />
    </video>
  );
}
