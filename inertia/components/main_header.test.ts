import { describe, it, expect, vi } from 'vitest'
import MainHeader from './MainHeader.vue'
import { mount } from '@vue/test-utils'

const usePageMock = vi.hoisted(() => ({
  usePage: vi.fn(),
}))

vi.mock('@inertiajs/vue3', async (importOriginal) => ({
  ...(await importOriginal()),
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
  it('shows customer tools while customer is logged in', () => {
    setCustomerLoggedIn(true)

    const wrapper = mount(MainHeader)

    const tools = wrapper.find('#customer-tools')
    expect(tools.exists()).toBe(true)
  })

  it('does not show customer tools customer is not logged in', () => {
    setCustomerLoggedIn(false)
    const wrapper = mount(MainHeader)

    const tools = wrapper.find('#customer-tools')
    expect(tools.exists()).toBe(false)
  })
})
