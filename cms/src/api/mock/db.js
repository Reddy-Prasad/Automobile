import { seedUsers } from '@/data/users'
import { STATUS } from '@/data/workflow'

function stamp(status, extra = {}) {
  return {
    status,
    updatedAt: '2026-09-20T14:00:00.000Z',
    updatedBy: 'Seed',
    history: [
      {
        at: '2026-09-20T14:00:00.000Z',
        by: 'Seed',
        action: 'seed',
        from: '',
        to: status,
      },
    ],
    ...extra,
  }
}

export const db = {
  users: seedUsers.map((user) => ({ ...user })),
  sessions: [],
  homepage: {
    id: 'homepage',
    eyebrow: 'Current offers',
    headline: 'Specials this month',
    subtitle: 'Manufacturer incentives and dealer savings, updated weekly.',
    ...stamp(STATUS.PUBLISHED),
  },
  seo: {
    id: 'seo',
    title: 'AutoDrive',
    description:
      'Shop new and certified pre-owned vehicles, current offers, financing, service and trade-in at AutoDrive.',
    ogImage: '',
    ...stamp(STATUS.PUBLISHED),
  },
  footer: {
    id: 'footer',
    blurb: 'New, used and certified vehicles across Texas.',
    phone: '(214) 555-0142',
    email: 'sales@autodrive.example',
    hours: 'Mon–Sat 9 AM–8 PM · Sun 11 AM–6 PM',
    ...stamp(STATUS.PUBLISHED),
  },
  navigation: {
    id: 'navigation',
    label: 'Main navigation',
    links: [
      { label: 'New', hash: '#new-vehicles' },
      { label: 'Used', hash: '#used-vehicles' },
      { label: 'Offers', hash: '#offers' },
      { label: 'Finance', name: 'finance' },
      { label: 'Trade-In', name: 'trade-in' },
      { label: 'Service', name: 'service' },
      { label: 'Locations', hash: '#locations' },
    ],
    ...stamp(STATUS.PUBLISHED),
  },
  pages: [
    {
      id: 'about',
      title: 'About AutoDrive',
      slug: 'about',
      body: 'AutoDrive is a classroom dealership site. This page is managed in the CMS, not hardcoded in the client.',
      ...stamp(STATUS.PUBLISHED),
    },
    {
      id: 'summer-hours',
      title: 'Summer hours',
      slug: 'summer-hours',
      body: 'Sunday service desk opens at 10am through Labor Day. Draft this copy, then send it for review.',
      ...stamp(STATUS.APPROVED, { updatedBy: 'Riley Brooks' }),
    },
  ],
  banners: [
    {
      id: 'rav4',
      theme: 'hero-slide--navy',
      icon: 'bi-car-front-fill',
      eyebrow: 'Offer of the month',
      title: '2026 Toyota RAV4 Hybrid at 1.9% APR',
      text: 'Up to 41 city mpg, standard AWD and Toyota Safety Sense 3.0. Financing for 60 months on approved credit.',
      primaryLabel: 'Shop new SUVs',
      primaryHash: '#new-vehicles',
      ...stamp(STATUS.PUBLISHED),
    },
    {
      id: 'cpo',
      theme: 'hero-slide--green',
      icon: 'bi-patch-check-fill',
      eyebrow: 'Certified Pre-Owned',
      title: 'Certified quality. Pre-owned price.',
      text: '172-point inspection, a 12-month/12,000-mile limited warranty and roadside assistance on every certified vehicle.',
      primaryLabel: 'Shop used vehicles',
      primaryHash: '#used-vehicles',
      ...stamp(STATUS.PUBLISHED),
    },
    {
      id: 'service',
      theme: 'hero-slide--charcoal',
      icon: 'bi-tools',
      eyebrow: 'Service center',
      title: 'Oil change and tire rotation from $59.95',
      text: 'Factory-trained technicians, genuine parts and a free multi-point inspection. Most visits done in under an hour.',
      primaryLabel: 'Book service',
      primaryHash: 'service',
      ...stamp(STATUS.PUBLISHED),
    },
    {
      id: 'labor-day',
      theme: 'hero-slide--navy',
      icon: 'bi-flag',
      eyebrow: 'Holiday event',
      title: 'Labor Day weekend: $500 extra off SUVs',
      text: 'Waiting in review. A reviewer must approve this before an admin can publish it to the client homepage.',
      primaryLabel: 'See SUVs',
      primaryHash: '#new-vehicles',
      ...stamp(STATUS.IN_REVIEW, { updatedBy: 'Casey Nguyen' }),
    },
  ],
  offers: [
    {
      id: 'rav4-apr',
      type: 'Finance',
      vehicle: '2026 Toyota RAV4 Hybrid',
      headline: '1.9% APR for 60 months',
      details: 'For well-qualified buyers through Toyota Financial Services.',
      expires: '2026-10-31',
      ...stamp(STATUS.PUBLISHED),
    },
    {
      id: 'f150-cash',
      type: 'Cash back',
      vehicle: '2026 Ford F-150 XLT',
      headline: '$3,500 customer cash',
      details: 'Plus an extra $750 for current Ford truck owners.',
      expires: '2026-10-15',
      ...stamp(STATUS.PUBLISHED),
    },
    {
      id: 'accord-lease',
      type: 'Lease',
      vehicle: '2026 Honda Accord Sport Hybrid',
      headline: '$329/mo for 36 months',
      details: '$2,999 due at signing. 10,000 miles per year.',
      expires: '2026-11-02',
      ...stamp(STATUS.PUBLISHED),
    },
    {
      id: 'civic-apr',
      type: 'Finance',
      vehicle: '2026 Honda Civic Sport',
      headline: '0.9% APR for 36 months',
      details: 'Editor draft. Save, then submit for review. It will not appear on the client site until published.',
      expires: '2026-11-15',
      ...stamp(STATUS.DRAFT, { updatedBy: 'Casey Nguyen' }),
    },
  ],
  media: [
    {
      id: 'hero-rav4',
      filename: 'hero-rav4.jpg',
      url: 'https://picsum.photos/seed/autodrive-rav4/960/540',
      alt: 'RAV4 Hybrid in the lot at dusk',
      ...stamp(STATUS.PUBLISHED),
    },
    {
      id: 'lot-wide',
      filename: 'lot-wide.jpg',
      url: 'https://picsum.photos/seed/autodrive-lot/960/540',
      alt: 'Wide shot of the AutoDrive lot',
      ...stamp(STATUS.DRAFT, { updatedBy: 'Casey Nguyen' }),
    },
  ],
}

export const counters = {
  pages: 2,
  banners: 4,
  offers: 4,
  media: 2,
}

export function nextId(type) {
  counters[type] = (counters[type] ?? 0) + 1
  return `${type}-${counters[type]}`
}

export const COLLECTIONS = ['pages', 'banners', 'offers', 'media']
export const SINGLETONS = ['homepage', 'seo', 'footer', 'navigation']
