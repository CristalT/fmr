import env from '#start/env'
import crypto from 'node:crypto'

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ValidateMercadopagoNotificationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Obtain the x-signature value from the header
    const xSignature = ctx.request.header('x-signature') // Assuming headers is an object containing request headers
    const xRequestId = ctx.request.header('x-request-id') // Assuming headers is an object containing request headers
    const dataID = ctx.request.input('data.id') // Assuming request.input is a method to get request body data

    if (!xSignature || !xRequestId || !dataID) {
      // If any of the required headers or data is missing, return an error response
      ctx.response.status(400).send({ error: 'Missing required headers or data' })
      return
    }

    const { ts, hash } = this.parseXSignature(xSignature)

    if (!ts || !hash) {
      // If the timestamp or hash is not present in the signature, return an error response
      ctx.response.status(400).send({ error: 'Invalid x-signature format' })
      return
    }

    // Obtain the secret key for the user/application from Mercadopago developers site
    const secret = env.get('MERCADOPAGO_SECRET_KEY')

    if (!secret) {
      // If the secret key is not set, return an error response
      ctx.response.status(500).send({ error: 'Secret key not configured' })
      return
    }

    // Generate the manifest string
    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`

    // Create an HMAC signature
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(manifest)

    // Obtain the hash result as a hexadecimal string
    const sha = hmac.digest('hex')

    if (sha === hash) {
      // HMAC verification passed
      return next()
    } else {
      // HMAC verification failed
      ctx.logger.error({ dataID }, 'HMAC verification failed')
      return ctx.response.status(403).send({ error: 'HMAC verification failed' })
    }
  }

  private parseXSignature(xSignature: string): { ts?: string; hash?: string } {
    return xSignature.split(',').reduce(
      (acc, part) => {
        const [key, value] = part.split('=').map((s) => s.trim())
        if (key === 'ts') acc.ts = value
        else if (key === 'v1') acc.hash = value
        return acc
      },
      { ts: undefined, hash: undefined } as { ts?: string; hash?: string }
    )
  }
}
