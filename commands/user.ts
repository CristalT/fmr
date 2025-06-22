import AdminUser from '#models/admin_user'
import { inject } from '@adonisjs/core'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class CreateAdminUser extends BaseCommand {
  static commandName = 'user:create'
  static description = 'Creates an admin user'

  static options: CommandOptions = {
    startApp: true,
  }

  @inject()
  async run(user: AdminUser) {
    user.email = await this.prompt.ask('Enter user email')
    user.password = await this.prompt.ask('Enter password')
    user.firstName = await this.prompt.ask('User first name')
    user.lastName = await this.prompt.ask('User last name')

    user
      .save()
      .then(() => {
        this.logger.info('Admin user successfully created!')
      })
      .catch((err: any) => {
        this.logger.error(err.message)
      })
      .finally(() => {
        process.exit()
      })
  }
}
