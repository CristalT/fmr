import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from './Select.vue'

describe('Select', () => {
  it('renders the select component with the passed options', () => {
    const wrapper = mount(Select, {
      props: {
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
