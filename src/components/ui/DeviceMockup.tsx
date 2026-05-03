import { useId, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

export type DeviceType = 'phone' | 'laptop'

/**
 * iPhone 14 Pro logical display — matches `baros-mobile-flow-capture.mjs` (viewport = `.screen` 393×852).
 */
const PHONE_CAPTURE_W = 393
const PHONE_CAPTURE_H = 852

// ─────────────────────────────────────────────────────────────────────────────
// Phone SVG — iPhone 14 Pro proportions, Space Black titanium finish
// ─────────────────────────────────────────────────────────────────────────────

function PhoneSVG({ children, uid }: { children: ReactNode; uid: string }) {
  // ViewBox 320 × 660 — outer chassis; screen aperture matches BarOS mobile captures (393:852)
  const W = 320, H = 660
  const FR = 50        // frame outer corner radius
  const BZ = 11        // minimum bezel inset from chassis edge
  const SR = 40        // screen inner corner radius
  const maxSw = W - BZ * 2
  const maxSh = H - BZ * 2
  const targetRatio = PHONE_CAPTURE_W / PHONE_CAPTURE_H
  let sw: number
  let sh: number
  if (maxSw / maxSh > targetRatio) {
    sh = maxSh
    sw = sh * targetRatio
  } else {
    sw = maxSw
    sh = sw / targetRatio
  }
  const sx = (W - sw) / 2
  const sy = Math.max(BZ, (H - sh) / 2)
  // Dynamic Island
  const diW = 88, diH = 28, diR = 14
  const diX = (W - diW) / 2, diY = 23

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      aria-hidden
    >
      <defs>
        {/* Titanium Space Black frame */}
        <linearGradient id={`${uid}-frame`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#3e3e40" />
          <stop offset="18%"  stopColor="#1c1c1e" />
          <stop offset="50%"  stopColor="#2d2d2f" />
          <stop offset="82%"  stopColor="#1c1c1e" />
          <stop offset="100%" stopColor="#3e3e40" />
        </linearGradient>

        {/* Top-edge catch-light (simulates glass bevel) */}
        <linearGradient id={`${uid}-edge`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
          <stop offset="30%"  stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>

        {/* Screen glass reflection */}
        <linearGradient id={`${uid}-glass`} x1="0%" y1="0%" x2="18%" y2="100%">
          <stop offset="0%"  stopColor="rgba(255,255,255,0.08)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>

        {/* Side-button gradient */}
        <linearGradient id={`${uid}-btn`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#3e3e40" />
          <stop offset="50%"  stopColor="#2a2a2c" />
          <stop offset="100%" stopColor="#3e3e40" />
        </linearGradient>

        {/* Screen clip */}
        <clipPath id={`${uid}-clip`}>
          <rect x={sx} y={sy} width={sw} height={sh} rx={SR} />
        </clipPath>
      </defs>

      {/* ── Body ── */}
      <rect width={W} height={H} rx={FR} fill={`url(#${uid}-frame)`} />

      {/* ── Screen background ── */}
      <rect x={sx} y={sy} width={sw} height={sh} rx={SR} fill="#000" />

      {/* ── Screenshot / video content ── */}
      <g clipPath={`url(#${uid}-clip)`}>
        <foreignObject x={sx} y={sy} width={sw} height={sh}>
          {/* xmlns required for correct HTML parsing inside SVG */}
          <div {...{ xmlns: 'http://www.w3.org/1999/xhtml' }}
            style={{ width: '100%', height: '100%' }}>
            {children}
          </div>
        </foreignObject>
      </g>

      {/* ── Screen glass sheen (pointer-events off so clicks pass through) ── */}
      <rect x={sx} y={sy} width={sw} height={sh} rx={SR}
        fill={`url(#${uid}-glass)`} style={{ pointerEvents: 'none' }} />

      {/* ── Frame bevel highlight ── */}
      <rect x={1.5} y={1.5} width={W - 3} height={H - 3} rx={FR - 1}
        fill="none" stroke={`url(#${uid}-edge)`} strokeWidth="1.5" />

      {/* ── Dynamic Island ── */}
      <rect x={diX} y={diY} width={diW} height={diH} rx={diR} fill="#000" />

      {/* ── Left buttons: mute, vol−, vol+ ── */}
      <rect x={-3} y={108} width={4} height={22} rx={2} fill={`url(#${uid}-btn)`} />
      <rect x={-3} y={155} width={4} height={50} rx={2} fill={`url(#${uid}-btn)`} />
      <rect x={-3} y={218} width={4} height={50} rx={2} fill={`url(#${uid}-btn)`} />

      {/* ── Right button: power ── */}
      <rect x={W - 1} y={170} width={4} height={68} rx={2} fill={`url(#${uid}-btn)`} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Laptop SVG — MacBook Pro proportions, silver aluminium
// ─────────────────────────────────────────────────────────────────────────────

function LaptopSVG({ children, uid }: { children: ReactNode; uid: string }) {
  // ViewBox 580 × 390
  const W = 580, H = 390
  // Lid
  const LX = 46, LY = 0, LW = 488, LH = 295, LR = 12
  // Screen (inset inside lid)
  const SX = LX + 17, SY = LY + 13, SW = LW - 34, SH = LH - 20
  // Base
  const BX = 0, BY = 292, BW = 580, BH = 98, BR = 6

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" overflow="visible" aria-hidden>
      <defs>
        {/* Silver aluminium lid */}
        <linearGradient id={`${uid}-lid`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#d8d8d8" />
          <stop offset="45%"  stopColor="#bcbcbc" />
          <stop offset="100%" stopColor="#a6a6a6" />
        </linearGradient>

        {/* Base gradient */}
        <linearGradient id={`${uid}-base`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#cbcbcb" />
          <stop offset="100%" stopColor="#9c9c9c" />
        </linearGradient>

        {/* Hinge */}
        <linearGradient id={`${uid}-hinge`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#b0b0b0" />
          <stop offset="100%" stopColor="#888888" />
        </linearGradient>

        {/* Lid edge highlight */}
        <linearGradient id={`${uid}-ledge`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </linearGradient>

        {/* Screen glass sheen */}
        <linearGradient id={`${uid}-glass`} x1="0%" y1="0%" x2="15%" y2="100%">
          <stop offset="0%"  stopColor="rgba(255,255,255,0.09)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>

        {/* Screen clip */}
        <clipPath id={`${uid}-clip`}>
          <rect x={SX} y={SY} width={SW} height={SH} rx={3} />
        </clipPath>
      </defs>

      {/* ── Lid ── */}
      <rect x={LX} y={LY} width={LW} height={LH} rx={LR}
        fill={`url(#${uid}-lid)`} />

      {/* ── Lid bevel highlight ── */}
      <rect x={LX + 1} y={LY + 1} width={LW - 2} height={LH - 2} rx={LR - 1}
        fill="none" stroke={`url(#${uid}-ledge)`} strokeWidth="1.5" />

      {/* ── Screen background ── */}
      <rect x={SX} y={SY} width={SW} height={SH} rx={3} fill="#000" />

      {/* ── Screenshot / video content ── */}
      <g clipPath={`url(#${uid}-clip)`}>
        <foreignObject x={SX} y={SY} width={SW} height={SH}>
          <div {...{ xmlns: 'http://www.w3.org/1999/xhtml' }}
            style={{ width: '100%', height: '100%' }}>
            {children}
          </div>
        </foreignObject>
      </g>

      {/* ── Screen glass sheen ── */}
      <rect x={SX} y={SY} width={SW} height={SH} rx={3}
        fill={`url(#${uid}-glass)`} style={{ pointerEvents: 'none' }} />

      {/* ── Camera ── */}
      <circle cx={W / 2} cy={SY + 7} r={4.2} fill="#111" />
      <circle cx={W / 2} cy={SY + 7} r={1.8} fill="#2c2c2c" />

      {/* ── Hinge bar ── */}
      <rect x={BX + 24} y={BY - 3} width={BW - 48} height={9} rx={2.5}
        fill={`url(#${uid}-hinge)`} />

      {/* ── Base ── */}
      <rect x={BX} y={BY} width={BW} height={BH} rx={BR}
        fill={`url(#${uid}-base)`} />

      {/* ── Base top highlight ── */}
      <rect x={BX + 1} y={BY + 1} width={BW - 2} height={BH - 2} rx={BR - 1}
        fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />

      {/* ── Trackpad outline ── */}
      <rect x={W / 2 - 66} y={BY + 28} width={132} height={54} rx={9}
        fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth="1.5" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Public component
// ─────────────────────────────────────────────────────────────────────────────

const SIZES = {
  phone:  { compact: { w: 175, h: 360 }, full: { w: 280, h: 577 } },
  laptop: { compact: { w: 320, h: 215 }, full: { w: 560, h: 376 } },
} as const

const SHADOW = {
  phone:  'drop-shadow(0 22px 38px rgba(0,0,0,0.58)) drop-shadow(0 6px 12px rgba(0,0,0,0.28))',
  laptop: 'drop-shadow(0 16px 30px rgba(0,0,0,0.38)) drop-shadow(0 4px 8px rgba(0,0,0,0.18))',
}

export interface DeviceMockupProps {
  device: DeviceType
  /** Static screenshot shown by default. */
  imageSrc: string
  /** Video that plays on hover (or always when `autoPlay` is true). */
  videoSrc?: string
  /** WebM version — preferred over MP4 when available. */
  videoSrcWebm?: string
  /** Controlled by parent: is the card being hovered? */
  isHovering?: boolean
  /** Loop video automatically (detail page demo sections). */
  autoPlay?: boolean
  /** Compact size for project cards. */
  compact?: boolean
  /** Disable 3-D tilt (e.g. gallery grid). */
  noTilt?: boolean
  className?: string
}

/**
 * Photorealistic device frame built entirely in SVG + Framer Motion.
 *
 * • Phone  — iPhone 14 Pro–style frame; screen opening matches full logical capture (393×852)
 * • Laptop — MacBook Pro proportions, silver aluminium, trackpad, camera
 *
 * Zero external assets required.  On hover the frame tilts in 3-D using
 * Framer Motion spring physics (disabled with `noTilt`).
 */
export default function DeviceMockup({
  device,
  imageSrc,
  videoSrc,
  videoSrcWebm,
  isHovering = false,
  autoPlay = false,
  compact = false,
  noTilt = false,
  className,
}: DeviceMockupProps) {
  // Unique SVG IDs per instance — prevents gradient conflicts in gallery grids
  const rawId = useId()
  const uid = rawId.replace(/:/g, 'x')

  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const sz = SIZES[device][compact ? 'compact' : 'full']
  const effectiveVideoSrc = videoSrcWebm ?? videoSrc

  // ── Framer Motion 3-D tilt ──────────────────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springCfg = { stiffness: 280, damping: 28 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springCfg)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springCfg)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (noTilt || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width - 0.5)
    mouseY.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onMouseLeave() { mouseX.set(0); mouseY.set(0) }

  // ── Video play / pause ──────────────────────────────────────────────────
  const shouldPlay = autoPlay || isHovering
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (shouldPlay) void v.play().catch(() => undefined)
    else v.pause()
  }, [shouldPlay, effectiveVideoSrc])

  // ── Media content rendered inside the SVG foreignObject ────────────────
  const media = (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Static screenshot */}
      <img
        src={imageSrc}
        alt=""
        draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'contain', objectPosition: 'top center',
          opacity: shouldPlay && effectiveVideoSrc ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Demo video */}
      {effectiveVideoSrc && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'contain', objectPosition: 'top center',
            opacity: shouldPlay ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
        </video>
      )}
    </div>
  )

  return (
    <motion.div
      ref={ref}
      style={{
        width: sz.w,
        height: sz.h,
        rotateX: noTilt ? 0 : rotateX,
        rotateY: noTilt ? 0 : rotateY,
        transformPerspective: 900,
        filter: SHADOW[device],
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn('mx-auto cursor-default select-none', className)}
    >
      {device === 'phone' ? (
        <PhoneSVG uid={uid}>{media}</PhoneSVG>
      ) : (
        <LaptopSVG uid={uid}>{media}</LaptopSVG>
      )}
    </motion.div>
  )
}
