/* eslint-disable prettier/prettier */
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('NODE_ENV') === 'test' ? 'fmr_site_test' : env.get('DB_DATABASE'),
        timezone: 'Z',
        dateStrings: ['DATE', 'DATETIME'],
        typeCast: true,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
