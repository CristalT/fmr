import env from '#start/env'

export default function () {
  return env.get('APP_URL')
}
