// Scale image proportionally if it exceeds max dimensions.
// Uses PNG to preserve transparency.
export function resizeImageToMax(base64, maxWidth, maxHeight) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img
      const ratio = Math.min(maxWidth / w, maxHeight / h, 1) // never upscale
      const newW = Math.round(w * ratio)
      const newH = Math.round(h * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = newW
      canvas.height = newH
      canvas.getContext('2d').drawImage(img, 0, 0, newW, newH)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = base64
  })
}

// Compress image to reduced JPEG for the brands endpoint (payload limit).
export function compressForBrandUpload(base64) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 300
      const ratio = Math.min(MAX / img.naturalWidth, MAX / img.naturalHeight, 1)
      const w = Math.round(img.naturalWidth * ratio)
      const h = Math.round(img.naturalHeight * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.src = base64
  })
}

// Crop image to center square and apply circular mask.
// Result is a transparent PNG outside the circle, with cover fit inside.
// This ensures the backend (which uses "contain") displays the icon
// filling the circular slot without black bars or empty space.
export function cropToCircle(base64, size) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      // Circular clip
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.clip()
      // Scale to cover the circle (equivalent to objectFit: cover)
      const scale = size / Math.min(w, h)
      const drawW = w * scale
      const drawH = h * scale
      const offsetX = (size - drawW) / 2
      const offsetY = (size - drawH) / 2
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = base64
  })
}

// Compress image to JPEG for stamp-card endpoint (payload limit).
// Flattens transparency onto bgColor (default white).
export function compressForStampCard(base64, quality = 0.85, bgColor = '#FFFFFF') {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = base64
  })
}

// Estimate the byte size of a base64 DataURL string.
export function estimateBase64Size(dataUrl) {
  if (!dataUrl) return 0
  const base64 = dataUrl.split(',')[1] || ''
  return Math.ceil(base64.length * 0.75)
}

// Sample the color at the circle edge of the image (4 cardinal points, just inside the border).
// Used to set the stamp slot background color, making it seamless.
export function sampleCircleEdgeColor(base64, size = 300) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)
      const r = size / 2
      const inset = 4
      const points = [
        [Math.round(r), inset],
        [Math.round(r), size - inset],
        [inset, Math.round(r)],
        [size - inset, Math.round(r)],
      ]
      let rSum = 0,
        gSum = 0,
        bSum = 0
      for (const [x, y] of points) {
        const d = ctx.getImageData(x, y, 1, 1).data
        rSum += d[0]
        gSum += d[1]
        bSum += d[2]
      }
      const n = points.length
      const toHex = (v) =>
        Math.round(v / n)
          .toString(16)
          .padStart(2, '0')
      resolve(`#${toHex(rSum)}${toHex(gSum)}${toHex(bSum)}`)
    }
    img.src = base64
  })
}
