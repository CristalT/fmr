import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Paginator from './Paginator.vue'
import { PAGE_INTERVAL } from './page_interval'
import { findByText } from '~/test-utils'

describe('Paginator', () => {
  it('renders correctly', () => {
    const wrapper = mount(Paginator, {
      props: {
        lastPage: 10,
        modelValue: 1,
      },
    })

    const prevPageButton = wrapper.find('#paginator__prev-page')
    const nextPageButton = wrapper.find('#paginator__next-page')

    let page = 1
    const pageButtons = page + PAGE_INTERVAL

    while (page <= pageButtons) {
      expect(findByText(wrapper, page.toString()).exists()).toBe(true)
      page++
    }

    expect(prevPageButton.exists()).toBe(true)
    expect(nextPageButton.exists()).toBe(true)
  })

  it('emits change event when a page is clicked', async () => {
    const wrapper = mount(Paginator, {
      props: {
        lastPage: 10,
        modelValue: 1,
      },
    })

    const pageButton = findByText(wrapper, '2')
    await pageButton?.trigger('click')

    expect(wrapper.emitted().change).toEqual([[2]])
  })
})
