import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AdminSideMenu from './AdminSideMenu.vue'
import { findByText } from '~/test_utils'
import { Menu } from './menu_builder'

const usePageMock = vi.hoisted(() => ({
  usePage: vi.fn().mockReturnValue({ url: '/option1' }),
}))

vi.mock('@inertiajs/vue3', async (importOriginal) => ({
  ...(await importOriginal()),
  usePage: usePageMock.usePage,
}))

const menuOptions = new Menu()
menuOptions
  .addOption({ label: 'Option 1', action: () => '/option1', icon: 'message' })
  .addOption({ label: 'Option 2', action: () => '/option2', icon: 'message' })
const options = menuOptions.getItems()

describe('AdminSideMenu Component', () => {
  it('toggles the menu collapse state', async () => {
    const wrapper = mount(AdminSideMenu, { props: { options } })

    const aside = wrapper.find('aside')

    const toggleButton = wrapper.find('div[role="button"]')
    expect(toggleButton.exists()).toBe(true)

    expect(aside.classes()).toContain('min-w-[15rem]')
    expect(aside.classes()).not.toContain('min-w-[4rem]')

    await toggleButton.trigger('click')
    expect(aside.classes()).toContain('min-w-[4rem]')
    expect(aside.classes()).not.toContain('min-w-[15rem]')

    await toggleButton.trigger('click')
    expect(aside.classes()).toContain('min-w-[15rem]')
    expect(aside.classes()).not.toContain('min-w-[4rem]')
  })
})
