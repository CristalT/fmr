import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from './Alert.vue'

describe('Alert', () => {
  it('render alert with text', () => {
    const wrapper = mount(Alert, {
      props: {
        variant: 'danger',
      },
      slots: {
        default: 'Test Alert',
      },
    })

    const alert = wrapper.find('div')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toBe('Test Alert')
    expect(alert.classes()).toContain('bg-red-600')
  })
})
