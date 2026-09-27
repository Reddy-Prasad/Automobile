import { ROLES } from './roles'

export const DEMO_PASSWORD = 'Password1!'

export const seedUsers = [
  {
    id: 2,
    name: 'Casey Nguyen',
    email: 'casey.editor@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.CMS_EDITOR,
  },
  {
    id: 3,
    name: 'Riley Brooks',
    email: 'riley.reviewer@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.CMS_REVIEWER,
  },
  {
    id: 4,
    name: 'Jordan Hale',
    email: 'jordan.admin@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.ADMIN,
  },
  {
    id: 1,
    name: 'Alex Rivera',
    email: 'alex.shopper@autodrive.example',
    password: DEMO_PASSWORD,
    role: 'CUSTOMER',
  },
]

export const demoAccounts = seedUsers
  .filter((user) => user.role !== 'CUSTOMER')
  .map(({ password, ...account }) => ({
    ...account,
    passwordHint: DEMO_PASSWORD,
  }))
