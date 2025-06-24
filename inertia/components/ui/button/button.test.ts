import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders the button as primary', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Test Button',
        variant: 'primary',
        full: true,
      },
    })

    const button = wrapper.find('button')
    expect(button.text()).toBe('Test Button')
    expect(button.classes()).toContain('bg-primary')
    expect(button.classes()).toContain('w-full')
  })

  it('renders the button as secondary', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Test Button',
        variant: 'secondary',
        full: false,
      },
    })

    const button = wrapper.find('button')
    expect(button.text()).toBe('Test Button')
    expect(button.classes()).toContain('bg-secondary')
    expect(button.classes()).not.toContain('w-full')
  })

  it('renders the button as tertiary', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Test Button',
        variant: 'tertiary',
        full: true,
      },
    })

    const button = wrapper.find('button')
    expect(button.text()).toBe('Test Button')
    expect(button.classes()).toContain('bg-gray-100')
    expect(button.classes()).toContain('w-full')
  })
})
