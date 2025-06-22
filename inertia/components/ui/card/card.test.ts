import { describe, expect, it } from 'vitest'
import Card from './Card.vue'
import { mount } from '@vue/test-utils'

describe('Card', () => {
  it('renders the card with header', () => {
    const wrapper = mount(Card, {
      slots: {
        header: 'Test Card',
      },
    })

    const header = wrapper.find('header')
    expect(header.exists()).toBe(true)
    expect(header.text()).toBe('Test Card')
  })

  it('renders the card with content', () => {
    const wrapper = mount(Card, {
      slots: {
        default: 'Test Card Content',
      },
    })

    const content = wrapper.find('article')
    expect(content.exists()).toBe(true)
    expect(content.text()).toBe('Test Card Content')
  })

  it('renders the card with footer', () => {
    const wrapper = mount(Card, {
      slots: {
        footer: 'Test Card Footer',
      },
    })

    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toBe('Test Card Footer')
  })
})
