import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import VehicleCard from './VehicleCard.vue'

vi.mock('@/stores/vehicleStore', () => ({
  useVehicleStore: () => ({
    saveVehicle: vi.fn(),
    byId: () => null,
  }),
}))

const vehicle = {
  id: 1,
  year: 2026,
  make: 'Toyota',
  model: 'RAV4',
  trim: 'XLE Premium Hybrid',
  price: 36990,
  msrp: 38450,
  image: '/images/vehicles/toyota-rav4.jpg',
  exteriorColor: 'Ice Cap',
  colorHex: '#adb5bd',
  mileage: 8,
  transmission: 'Automatic',
  fuelType: 'Hybrid',
  efficiency: '41 city / 38 hwy mpg',
  condition: 'new',
  availability: 'AVAILABLE',
  stockNumber: 'N26104',
  featured: true,
  bodyType: 'SUV',
}

describe('VehicleCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('details link uses the path parameter and the image has alt text', () => {
    const wrapper = mount(VehicleCard, {
      props: { vehicle },
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="JSON.stringify(to)"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.get('img').attributes('alt')).toBe('2026 Toyota RAV4 in Ice Cap')
    expect(wrapper.get('a').attributes('href')).toContain('vehicle-details')
    expect(wrapper.get('a').attributes('href')).toContain('"id":"1"')
  })
})
