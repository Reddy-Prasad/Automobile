export const dealer = {
  name: 'AutoDrive',
  tagline: 'New, used and certified vehicles across Texas',
  phone: '(214) 555-0142',
  phoneHref: 'tel:+12145550142',
  email: 'sales@autodrive.example',
  hoursSummary: 'Mon–Sat 9 AM–8 PM · Sun 11 AM–6 PM',
  social: [
    { label: 'Facebook', icon: 'bi-facebook', href: 'https://www.facebook.com' },
    { label: 'Instagram', icon: 'bi-instagram', href: 'https://www.instagram.com' },
    { label: 'YouTube', icon: 'bi-youtube', href: 'https://www.youtube.com' },
  ],
}

export const locations = [
  {
    id: 'dallas',
    name: 'AutoDrive Dallas',
    street: '7400 Lemmon Motor Pkwy',
    city: 'Dallas',
    state: 'TX',
    zip: '75209',
    phone: '(214) 555-0142',
    phoneHref: 'tel:+12145550142',
    hours: [
      { days: 'Mon–Fri', time: '9:00 AM – 8:00 PM' },
      { days: 'Saturday', time: '9:00 AM – 7:00 PM' },
      { days: 'Sunday', time: '11:00 AM – 6:00 PM' },
    ],
    departments: ['Sales', 'Service', 'Parts', 'Collision'],
  },
  {
    id: 'austin',
    name: 'AutoDrive Austin',
    street: '11800 Research Auto Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '78759',
    phone: '(512) 555-0187',
    phoneHref: 'tel:+15125550187',
    hours: [
      { days: 'Mon–Fri', time: '9:00 AM – 8:00 PM' },
      { days: 'Saturday', time: '9:00 AM – 6:00 PM' },
      { days: 'Sunday', time: 'Closed' },
    ],
    departments: ['Sales', 'Service', 'EV Center'],
  },
  {
    id: 'houston',
    name: 'AutoDrive Houston',
    street: '2250 Gulf Freeway Auto Row',
    city: 'Houston',
    state: 'TX',
    zip: '77017',
    phone: '(713) 555-0126',
    phoneHref: 'tel:+17135550126',
    hours: [
      { days: 'Mon–Fri', time: '8:30 AM – 8:00 PM' },
      { days: 'Saturday', time: '9:00 AM – 7:00 PM' },
      { days: 'Sunday', time: '12:00 PM – 5:00 PM' },
    ],
    departments: ['Sales', 'Service', 'Parts'],
  },
]
