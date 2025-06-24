const IMAGES_URL = 'uploads/images'
const STATIC_PATH = 'public/static'

export default function usePath(origin = '') {
  function imagePath(filename?: string): string {
    if (filename) return `${origin}/${IMAGES_URL}/${filename}?t=${new Date().getTime()}`
    return ''
  }

  function staticPath(filename: string): string {
    return `${origin}/${STATIC_PATH}/${filename}`
  }

  return { imagePath, staticPath }
}
