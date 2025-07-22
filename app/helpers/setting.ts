import Setting from '#models/setting'

export default function setting(key: string, defaultValue?: any) {
  return Setting.get(key, defaultValue)
}
