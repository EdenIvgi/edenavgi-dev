/**
 * BackgroundSmear
 * ───────────────
 * A single thick colour band that runs top-to-bottom across the full page
 * (absolute — scrolls with content), curving gently in an S-shape and
 * angling slightly right → left.
 *
 * Colour:  Blue-indigo family (#4a7cf7 → #6366f1) — derived from the site's
 *          primary oklch(0.72 0.18 250) token.
 * Opacity: 7 % light-mode / 18 % dark-mode — vivid enough to feel, quiet
 *          enough to never fight the content.
 */
export default function BackgroundSmear() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 right-0 -z-10 overflow-hidden"
      style={{ height: '140vh', minHeight: '140vh' }}
    >
      {/* ── Colour stripe ─────────────────────────────────────────────────
          The SVG path draws the stripe; CSS blur gives it soft, paint-like edges.
          Opacity is kept very low in light-mode, a bit higher in dark-mode. */}
      <div
        className="absolute inset-0 opacity-[0.07] dark:opacity-[0.18]"
        style={{ filter: 'blur(32px)' }}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="smear-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#4a7cf7" stopOpacity="0"   />
              <stop offset="7%"   stopColor="#4a7cf7" stopOpacity="1"   />
              <stop offset="42%"  stopColor="#6366f1" stopOpacity="0.92"/>
              <stop offset="75%"  stopColor="#4a7cf7" stopOpacity="0.95"/>
              <stop offset="93%"  stopColor="#6366f1" stopOpacity="1"   />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0"   />
            </linearGradient>
          </defs>

          {/*
            Strong diagonal: stripe centre drifts from x≈75 (top) to x≈43 (bottom)
            — a ~32-unit right-to-left lean over the full page height.
            S-curve wobble is preserved on top of the diagonal angle.
            Stripe width: ≈ 25 SVG units throughout.
          */}
          <path
            d="
              M 62 0
              C 70 18, 54 32, 64 50
              C 74 68, 56 82, 53 100
              L 28 100
              C 33 82, 31 68, 41 50
              C 51 32, 35 18, 37 0
              Z
            "
            fill="url(#smear-grad)"
          />
        </svg>
      </div>
    </div>
  )
}
