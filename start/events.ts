import emitter from '@adonisjs/core/services/emitter'

import UserCreated from '#events/user_created'
import PasswordReset from '#events/password_reset'
import PasswordForgot from '#events/password_forgot'

emitter.listen(UserCreated, [
  () => import('#listeners/remove_registry'),
  () => import('#listeners/send_welcome_email'),
])

emitter.listen(PasswordReset, [() => import('#listeners/send_password_reset_confirmation')])
emitter.listen(PasswordForgot, [() => import('#listeners/send_password_recovery')])
