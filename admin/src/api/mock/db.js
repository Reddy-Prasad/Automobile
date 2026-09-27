import {
  seedFinanceApplications,
  seedServiceBookings,
  seedTestDrives,
  seedTradeIns,
} from '../../../../client/src/data/accountSeeds.js'
import { dealer, locations } from '../../../../client/src/data/dealer.js'
import { vehicles as seedVehicles } from '../../../../client/src/data/vehicles.js'
import { seedUsers } from '@/data/users'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

const draftVehicle = {
  id: 25,
  stockNumber: 'N26991',
  condition: 'new',
  year: 2026,
  make: 'Honda',
  model: 'Civic',
  trim: 'Sport',
  bodyType: 'Sedan',
  fuelType: 'Gas',
  transmission: 'Automatic',
  availability: 'AVAILABLE',
  drivetrain: 'FWD',
  mileage: 6,
  msrp: 28990,
  price: 27450,
  efficiency: '31 city / 40 hwy mpg',
  exteriorColor: 'Rallye Red',
  colorHex: '#b22222',
  image: '/images/vehicles/honda-accord.jpg',
  featured: false,
  listingStatus: 'draft',
}

export const db = {
  users: clone(seedUsers),
  sessions: [],
  vehicles: [
    ...clone(seedVehicles).map((vehicle) => ({
      ...vehicle,
      listingStatus: 'published',
    })),
    draftVehicle,
  ],
  customers: [
    {
      id: 1,
      name: 'Alex Rivera',
      email: 'alex.shopper@autodrive.example',
      phone: '(214) 555-0199',
      store: 'AutoDrive Dallas',
    },
    {
      id: 2,
      name: 'Priya Shah',
      email: 'priya.shah@example.com',
      phone: '(512) 555-0160',
      store: 'AutoDrive Austin',
    },
  ],
  leads: [
    {
      id: 1,
      name: 'Chris Nguyen',
      email: 'chris.n@example.com',
      phone: '(713) 555-0104',
      source: 'Website',
      interest: '2026 RAV4 Hybrid',
      status: 'new',
      createdAt: '2026-09-26T15:00:00.000Z',
    },
    {
      id: 2,
      name: 'Morgan Lee',
      email: 'morgan.lee@example.com',
      phone: '(214) 555-0177',
      source: 'Phone',
      interest: 'F-150 XLT',
      status: 'contacted',
      createdAt: '2026-09-24T15:00:00.000Z',
    },
  ],
  testdrives: clone(seedTestDrives),
  service: clone(seedServiceBookings),
  finance: clone(seedFinanceApplications),
  tradeins: clone(seedTradeIns),
  dealers: clone(locations),
  settings: {
    name: dealer.name,
    phone: dealer.phone,
    email: dealer.email,
    hours: dealer.hoursSummary,
  },
}

export const counters = {
  vehicle: 26,
  customer: 3,
  lead: 3,
  user: seedUsers.length + 1,
}

export function nextId(type) {
  const id = counters[type] ?? 1
  counters[type] = id + 1
  return id
}

export const BOARD_KEYS = ['customers', 'leads', 'testdrives', 'service', 'finance', 'tradeins']
