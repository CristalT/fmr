const IMAGES_URL = 'uploads/images'
const STATIC_PATH = 'static'

export default function usePath() {
  const { origin } = window.location
  function imagePath(filename?: string): string {
    if (filename) return `${origin}/${IMAGES_URL}/${filename}?t=${new Date().getTime()}`
    return ''
  }

  function staticPath(filename: string): string {
    return `${origin}/${STATIC_PATH}/${filename}`
  }

  return { imagePath, staticPath }
}
