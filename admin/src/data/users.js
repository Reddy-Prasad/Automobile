import { seedUsers as clientUsers } from '../../../client/src/data/users.js'
import { ADMIN_ROLES, ROLES } from './roles'

export const DEMO_PASSWORD = 'Password1!'

export const seedUsers = clientUsers.map((user) => ({ ...user }))

export const demoAccounts = seedUsers
  .filter((user) => ADMIN_ROLES.includes(user.role))
  .map(({ password, ...account }) => ({
    ...account,
    passwordHint: DEMO_PASSWORD,
  }))

export { ROLES }
