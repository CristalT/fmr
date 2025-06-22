import env from '#start/env'

const isLocal = env.get('LOCAL') === 'true'

export const UPLOADS_FOLDER = isLocal ? 'uploads' : '../uploads'
