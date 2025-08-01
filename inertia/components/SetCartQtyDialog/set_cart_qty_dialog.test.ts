import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { findByText } from '~/test_utils'

import SetCartQtyDialog from './SetCartQtyDialog.vue'

import type Product from '#models/product'

describe('SetCartQtyDialog', () => {
  it('renders correctly with default props', async () => {
    const wrapper = mount(SetCartQtyDialog, {
      props: {
        visible: true,
        qty: 1,
        product: { id: '1', code: 'P001', name: 'Product 1', price: 100 } as Product,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    expect(findByText(wrapper, 'Product 1').exists()).toBe(true)
    expect(findByText(wrapper, 'P001').exists()).toBe(true)

    const input = wrapper.find('input[type="number"]')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).value).toBe('1')
  })

  it('emits update event with correct payload on form submit', async () => {
    const wrapper = mount(SetCartQtyDialog, {
      props: {
        visible: true,
        qty: 1,
        product: { id: '1', code: 'P001', name: 'Product 1', price: 100 } as Product,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    const input = wrapper.find('input[type="number"]')
    await input.setValue('2')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')![0]).toEqual([
      { product: { id: '1', code: 'P001', name: 'Product 1', price: 100 }, qty: 2 },
    ])
  })
})
