export type DeviceVariant = 'iphone-16pro' | 'ipad-11'

export interface Aperture {
  imgW: number
  imgH: number
  x: number
  y: number
  w: number
  h: number
  radius: number
}

// Coordinates measured programmatically from public/devices/ PNGs via PIL centerline scan.
// imgW/imgH — full PNG dimensions.  x/y/w/h — screen aperture in PNG pixels.  radius — corner radius in PNG pixels.
export const APERTURES: Record<DeviceVariant, Aperture> = {
  'iphone-16pro': { imgW: 1350, imgH: 2760, x: 73, y: 70, w: 1204, h: 2620, radius: 165 },
  'ipad-11':      { imgW: 3960, imgH: 2820, x: 166, y: 160, w: 3628, h: 2500, radius: 54 },
}
