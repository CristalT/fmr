import { describe, it, expect, vi } from 'vitest'
import MainHeader from './MainHeader.vue'
import { mount } from '@vue/test-utils'

const usePageMock = vi.hoisted(() => ({
  usePage: vi.fn(),
}))

vi.mock('@inertiajs/vue3', () => ({
  usePage: usePageMock.usePage,
}))

function setCustomerLoggedIn(value: boolean) {
  usePageMock.usePage.mockReturnValue({
    props: {
      auth: {
        isCustomerLoggedIn: value,
      },
      errors: {},
    },
  })
}

describe('main header', () => {
  it('shows cart icon while customer is logged in', () => {
    setCustomerLoggedIn(true)

    const wrapper = mount(MainHeader)

    const icon = wrapper.findComponent({ name: 'Icon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('cart')
  })

  it('does not show cart icon while customer is not logged in', () => {
    setCustomerLoggedIn(false)
    const wrapper = mount(MainHeader)

    const icon = wrapper.findComponent({ name: 'Icon' })
    expect(icon.exists()).toBe(false)
  })
})
