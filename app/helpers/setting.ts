import Setting from '#models/setting'

export default function setting(key: string) {
  return Setting.get(key)
}
