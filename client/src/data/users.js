import { ROLES } from './roles'

export const DEMO_PASSWORD = 'Password1!'

export const seedUsers = [
  {
    id: 1,
    name: 'Alex Rivera',
    email: 'alex.shopper@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.CUSTOMER,
    app: 'client',
  },
  {
    id: 2,
    name: 'Casey Nguyen',
    email: 'casey.editor@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.CMS_EDITOR,
    app: 'cms',
  },
  {
    id: 3,
    name: 'Riley Brooks',
    email: 'riley.reviewer@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.CMS_REVIEWER,
    app: 'cms',
  },
  {
    id: 4,
    name: 'Jordan Hale',
    email: 'jordan.admin@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.ADMIN,
    app: 'admin',
  },
  {
    id: 5,
    name: 'Morgan Ellis',
    email: 'morgan.inventory@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.INVENTORY_MANAGER,
    app: 'admin',
  },
  {
    id: 6,
    name: 'Sam Patel',
    email: 'sam.service@autodrive.example',
    password: DEMO_PASSWORD,
    role: ROLES.SERVICE_MANAGER,
    app: 'admin',
  },
]

export const demoAccounts = seedUsers.map(({ password, ...account }) => ({
  ...account,
  passwordHint: DEMO_PASSWORD,
}))
