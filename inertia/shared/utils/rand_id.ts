/**
 * Generate a random ID
 */
export default function randId() {
  return Math.random().toString(36).slice(2)
}
