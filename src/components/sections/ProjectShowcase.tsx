import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import DeviceFrame from '@/components/ui/DeviceFrame'

export interface ProjectShowcaseProps {
  /** Content rendered inside the iPad screen (image or element). */
  tabletScreen?: ReactNode
  /** Content rendered inside the static iPhone screen (left). */
  phoneScreen?: ReactNode
  /** Static screenshot for the second iPhone (right). Takes priority over videoPhone. */
  phoneScreen2?: ReactNode
  /** Video played inside the second iPhone. Used only when phoneScreen2 is absent. */
  videoPhone?: { mp4?: string; webm?: string; poster?: string }
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

/** Gap that clears the iPhone 16 Pro Dynamic Island pill (~4.5 % of screen height). */
function DynamicIslandGap() {
  return <div style={{ height: '4.5%', flexShrink: 0 }} />
}

function ScreenImg({ src, alt = '', dynamicIsland = false }: { src: string; alt?: string; dynamicIsland?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {dynamicIsland && <DynamicIslandGap />}
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ flex: 1, width: '100%', minHeight: 0, objectFit: 'cover', objectPosition: 'top center' }}
      />
    </div>
  )
}

function VideoScreen({ mp4, webm, poster }: { mp4?: string; webm?: string; poster?: string }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
    >
      {webm && <source src={webm} type="video/webm" />}
      {mp4  && <source src={mp4}  type="video/mp4" />}
    </video>
  )
}

/**
 * Hero scene — Apple device frames in a layered 3-D composition.
 *
 * 3-device (default):  [ iPhone ]  [ iPad Pro 11" ]  [ iPhone ]
 * 2-device (no right phone content): [ iPhone ]  [ iPad Pro 11" ]
 */
export default function ProjectShowcase({ tabletScreen, phoneScreen, phoneScreen2, videoPhone }: ProjectShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const hasRightPhone = !!phoneScreen2 || !!videoPhone

  return (
    <div
      ref={ref}
      className="relative w-full select-none overflow-visible py-6"
      style={{ perspective: '1200px' }}
    >
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-center md:gap-0">

        {/* iPhone — left */}
        <motion.div
          custom={0.15}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className={hasRightPhone
            ? 'w-[42vw] max-w-[160px] shrink-0 md:w-[14%] md:max-w-none'
            : 'w-[42vw] max-w-[160px] shrink-0 md:w-[18%] md:max-w-none'}
          style={{
            transform: hasRightPhone
              ? 'perspective(900px) rotateY(12deg) translateZ(40px)'
              : 'perspective(900px) rotateY(10deg) translateZ(40px)',
            marginRight: hasRightPhone ? '-3%' : '-2%',
            filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.45))',
            zIndex: 2,
          }}
        >
          <DeviceFrame variant="iphone-16pro">
            {typeof phoneScreen === 'string'
              ? <ScreenImg src={phoneScreen} dynamicIsland />
              : phoneScreen ?? null}
          </DeviceFrame>
        </motion.div>

        {/* iPad Pro 11" — centre */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className={hasRightPhone
            ? 'w-[90vw] max-w-[520px] shrink-0 md:w-[58%] md:max-w-none'
            : 'w-[90vw] max-w-[520px] shrink-0 md:w-[62%] md:max-w-none'}
          style={{
            filter: 'drop-shadow(0 32px 56px rgba(0,0,0,0.5))',
            zIndex: 1,
          }}
        >
          <DeviceFrame variant="ipad-11">
            {typeof tabletScreen === 'string'
              ? <ScreenImg src={tabletScreen} />
              : tabletScreen ?? null}
          </DeviceFrame>
        </motion.div>

        {/* iPhone — right (only rendered when content is provided) */}
        {hasRightPhone && (
          <motion.div
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="w-[42vw] max-w-[160px] shrink-0 md:w-[14%] md:max-w-none"
            style={{
              transform: 'perspective(900px) rotateY(-12deg) translateZ(40px)',
              filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.45))',
              zIndex: 2,
              marginLeft: '-3%',
            }}
          >
            <DeviceFrame variant="iphone-16pro">
              {phoneScreen2
                ? (typeof phoneScreen2 === 'string' ? <ScreenImg src={phoneScreen2} dynamicIsland /> : phoneScreen2)
                : videoPhone
                  ? <VideoScreen {...videoPhone} />
                  : null}
            </DeviceFrame>
          </motion.div>
        )}
      </div>
    </div>
  )
}
