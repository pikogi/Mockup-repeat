import { PROGRAM_IMAGES_BASE_URL } from '../client'

export function createImagesNamespace(client) {
  return {
    createStampCard: (
      programId,
      stampBackgroundImage = null,
      stampIconImage = null,
      logoImage = null,
      stampIconBg = '#000000',
    ) => {
      const body = {
        program_id: programId,
        stamp_icon_background_checked: stampIconBg,
        stamp_icon_background_unchecked: stampIconBg,
      }
      if (stampBackgroundImage) body.stamp_background_image = stampBackgroundImage
      if (stampIconImage) body.stamp_icon_image = stampIconImage
      if (logoImage) body.logo_image = logoImage
      return client.post('/images/stamp-card', body)
    },

    getStampCardUrl: (programId, stampCount = 0) => {
      const padded = String(stampCount).padStart(2, '0')
      return `${PROGRAM_IMAGES_BASE_URL}/${programId}-${padded}.png`
    },

    getLogoUrl: (brandId) => (brandId ? `${PROGRAM_IMAGES_BASE_URL}/logo-${brandId}.png` : null),
  }
}
