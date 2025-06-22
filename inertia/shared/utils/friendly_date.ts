import { DateTime } from 'luxon'

/**
 * Converts an ISO 8601 date to a friendly string
 */
export default function friendlyDate(date: string | DateTime<boolean>) {
  if (!date) return ''
  return DateTime.fromISO(date.toString())
    .setLocale('es')
    .toLocaleString(DateTime.DATETIME_SHORT)
    .replace(',', ' ')
}
