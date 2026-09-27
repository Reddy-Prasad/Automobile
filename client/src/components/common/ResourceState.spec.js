import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import ResourceState from './ResourceState.vue'

describe('ResourceState', () => {
  test('loading keeps the spinner until status leaves loading', () => {
    const wrapper = mount(ResourceState, { props: { status: 'loading' } })
    expect(wrapper.get('[role="status"]').text()).toMatch(/Talking to the API/)
  })

  test('success renders the default slot — that is how a 200 with data reaches the UI', () => {
    const wrapper = mount(ResourceState, {
      props: { status: 'success' },
      slots: { default: '<p>24 vehicles</p>' },
    })
    expect(wrapper.text()).toContain('24 vehicles')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })
})
