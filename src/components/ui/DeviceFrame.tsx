import type { ReactNode } from 'react'
import { APERTURES, type DeviceVariant } from '@/utils/deviceApertures'
import { cn } from '@/utils/cn'

const DEVICE_IMGS: Record<DeviceVariant, string> = {
  'iphone-16pro': '/devices/iphone-16pro.png',
  'ipad-11':      '/devices/ipad-11.png',
}

export interface DeviceFrameProps {
  variant: DeviceVariant
  children?: ReactNode
  className?: string
}

/**
 * Renders an Apple device bezel (real PNG from Apple Design Resources) with an
 * inner screen slot. Children are placed behind the PNG exactly over the screen
 * aperture — clipped to the screen's rounded rectangle.
 *
 * Width is 100% of the parent; aspect ratio is preserved automatically.
 */
export default function DeviceFrame({ variant, children, className }: DeviceFrameProps) {
  const { imgW, imgH, x, y, w, h, radius } = APERTURES[variant]
  const src = DEVICE_IMGS[variant]

  // Convert aperture pixel coords → percentages of PNG dimensions.
  const left   = (x / imgW) * 100
  const top    = (y / imgH) * 100
  const width  = (w / imgW) * 100
  const height = (h / imgH) * 100

  // Circular corner radius expressed as % of each dimension so it scales correctly.
  const rx = (radius / w) * 100
  const ry = (radius / h) * 100

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ aspectRatio: `${imgW} / ${imgH}` }}
    >
      {/* Screen slot — sits behind the PNG frame */}
      <div
        style={{
          position: 'absolute',
          left:   `${left}%`,
          top:    `${top}%`,
          width:  `${width}%`,
          height: `${height}%`,
          borderRadius: `${rx.toFixed(2)}% / ${ry.toFixed(2)}%`,
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {children}
      </div>

      {/* Device frame PNG — drawn on top so bezel hides any overflow */}
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 10,
        }}
      />
    </div>
  )
}
