export type ProjectCategory = 'web' | 'mobile' | 'other'

export interface ProjectScreenshot {
  src: string
  alt: string
  /** Short label under the image in the project detail gallery */
  caption?: string
}

export interface ProjectShowcaseSlots {
  /** Screenshot displayed in the iPad Pro 11" frame (landscape, 1194×834 ideal). */
  tabletScreen?: string
  /** Screenshot displayed in the static iPhone frame (left). */
  phoneScreen?: string
  /** Screenshot displayed in the second iPhone frame (right). Takes priority over videoPhone. */
  phoneScreen2?: string
  /** Video autoplayed in the second iPhone frame. Used only when phoneScreen2 is absent. */
  videoPhone?: { mp4?: string; webm?: string; poster?: string }
}

export interface Project {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  category: ProjectCategory
  thumbnail: string
  /** App logo shown on the project card. Add to /public/projects/logos/<id>.png */
  logo?: string
  videoSrc?: string
  videoSrcWebm?: string
  /** Autoplaying loop GIF (detail page; shows full flow, no play button) */
  flowDemoGif?: string
  /**
   * When set, all visual media (thumbnail, gallery, GIF/video) is rendered inside
   * a photorealistic device mockup frame on the detail page and project card.
   * 'phone' → iPhone 14 Pro frame  |  'laptop' → MacBook Pro frame
   */
  deviceFrame?: 'phone' | 'laptop'
  /** Hero scene: 3 device frames on the detail page. All slots optional — absent slots show a black screen. */
  showcase?: ProjectShowcaseSlots
  /** @deprecated prefer screenshotGallery; kept for simple path-only lists */
  screenshots: string[]
  /** When set, detail page uses this (captions, alt). Falls back to `screenshots` if empty. */
  screenshotGallery?: ProjectScreenshot[]
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  year: number
}
