import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input', () => {
  it('render input text with label', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Test Input',
        type: 'text',
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')

    const label = wrapper.find('#input__label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Input')
  })

  it('render input text as textarea', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Test Input',
        type: 'textarea',
      },
    })

    const input = wrapper.find('textarea')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type'))
  })

  it('renders input text with error', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Test Input',
        type: 'text',
        error: 'Test Error',
      },
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('border-red-500')

    const error = wrapper.find('#input__error')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Test Error.')
  })

  it('renders input with array of errors', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Test Input',
        type: 'text',
        error: ['Test Error 1', 'Test Error 2'],
      },
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('border-red-500')

    const error = wrapper.find('#input__error')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Test Error 1. Test Error 2.')
  })

  it('shows clear button when clearable is true', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'test',
        label: 'Test Input',
        type: 'text',
        clearable: true,
      },
    })

    const clearButton = wrapper.find('button')
    expect(clearButton.exists()).toBe(true)

    await clearButton.trigger('click')

    const input = wrapper.find('input')
    expect(input.element.value).toBe('')

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
  })
})
