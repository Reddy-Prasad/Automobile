import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Modal from './Modal.vue'

describe('Modal', () => {
  test('closed modal is not in the document', () => {
    const wrapper = mount(Modal, { props: { open: false, title: 'Delete draft?' } })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  test('open modal is labelled and Escape cancels', async () => {
    const wrapper = mount(Modal, { props: { open: true, title: 'Delete draft?' }, attachTo: document.body })
    expect(wrapper.get('[role="dialog"]').attributes('aria-modal')).toBe('true')
    expect(wrapper.get('#shared-modal-title').text()).toBe('Delete draft?')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('cancel')).toBeTruthy()
    wrapper.unmount()
  })
})
