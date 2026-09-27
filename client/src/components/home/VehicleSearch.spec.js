import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import VehicleSearch from './VehicleSearch.vue'

const vehicles = [
  { make: 'Toyota', bodyType: 'SUV', condition: 'new', price: 36990 },
  { make: 'Ford', bodyType: 'Truck', condition: 'used', price: 52995 },
]

function mountSearch() {
  return mount(VehicleSearch, {
    props: { vehicles },
    global: {
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })
}

describe('VehicleSearch', () => {
  test('submit emits the current filters', async () => {
    const wrapper = mountSearch()
    await wrapper.get('#search-make').setValue('Toyota')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('search')[0][0]).toMatchObject({ make: 'Toyota' })
  })

  test('button count drops when the filter excludes the truck', async () => {
    const wrapper = mountSearch()
    expect(wrapper.get('button[type="submit"]').text()).toMatch(/2 vehicles/)
    await wrapper.get('#search-make').setValue('Toyota')
    expect(wrapper.get('button[type="submit"]').text()).toMatch(/1 vehicle/)
  })
})
