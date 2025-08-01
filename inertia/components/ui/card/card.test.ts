import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { findByText } from '~/test_utils'

import Card from './Card.vue'

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

  it('renders the card with title', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Test Card Title',
      },
    })

    const title = findByText(wrapper, 'Test Card Title')
    expect(title.exists()).toBe(true)
  })
})
