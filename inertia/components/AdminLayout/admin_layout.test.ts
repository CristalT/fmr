import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AdminLayout from './AdminLayout.vue'

const usePageMock = vi.hoisted(() => ({
  usePage: vi.fn().mockReturnValue({ url: '/' }),
}))

vi.mock('@inertiajs/vue3', async (importOriginal) => ({
  ...(await importOriginal()),
  usePage: usePageMock.usePage,
}))

describe('AdminLayout.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(AdminLayout, {
      slots: {
        default: '<div class="slot-content">Hello Admin</div>',
      },
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello Admin')
  })

  it('renders the topbar slot content', () => {
    const wrapper = mount(AdminLayout, {
      slots: {
        footer: '<div class="slot-content">Hello Topbar</div>',
      },
    })

    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello Topbar')
  })

  it('renders the footer slot content', () => {
    const wrapper = mount(AdminLayout, {
      slots: {
        footer: '<div class="slot-content">Hello Footer</div>',
      },
    })

    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello Footer')
  })

  it('renders sidebar', () => {
    const wrapper = mount(AdminLayout)
    expect(wrapper.findComponent({ name: 'AdminSideMenu' }).exists()).toBe(true)
  })

  it('has the toast component to show notifications', () => {
    const wrapper = mount(AdminLayout)
    expect(wrapper.findComponent({ name: 'Toast' }).exists()).toBe(true)
  })

  it('shows a loading indicator if prop is passed', () => {
    const wrapper = mount(AdminLayout, { props: { loading: true } })
    const loadingIndicator = wrapper.findComponent({ name: 'LoadingOverlay' })
    expect(loadingIndicator.exists()).toBe(true)
    expect(loadingIndicator.props('loading')).toBe(true)
  })
})
