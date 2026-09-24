export const mainNav = [
  { label: 'New', hash: '#new-vehicles' },
  { label: 'Used', hash: '#used-vehicles' },
  { label: 'Offers', hash: '#offers' },
  { label: 'Finance', name: 'finance' },
  { label: 'Trade-In', hash: '#trade-in' },
  { label: 'Service', hash: '#service' },
  { label: 'Locations', hash: '#locations' },
]

export function navLinkTo(link) {
  if (link.name) return { name: link.name }
  return { name: 'home', hash: link.hash }
}
