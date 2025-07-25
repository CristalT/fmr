import { describe, it, expect, vi } from 'vitest'
import ProviderSelect from './ProviderSelect.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('~/composables', () => {
  return {
    useProvider: () => ({
      fetchOptions: () => ({
        data: ref([
          { value: 'AB', label: 'AB' },
          { value: 'CD', label: 'CD' },
          { value: 'EF', label: 'EF' },
        ]),
      }),
    }),
  }
})

describe('ProviderSelect', () => {
  it('should render provider select', async () => {
    const wrapper = mount(ProviderSelect, { props: { modelValue: '' } })

    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.exists()).toBe(true)

    expect(select.props('options')).toEqual([
      { value: 'AB', label: 'AB' },
      { value: 'CD', label: 'CD' },
      { value: 'EF', label: 'EF' },
    ])

    expect(select.text()).toContain('Seleccione una opción')
  })

  it('should render provider select with selected value', async () => {
    const wrapper = mount(ProviderSelect, { props: { modelValue: 'AB' } })

    await flushPromises()

    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.exists()).toBe(true)

    expect(select.text()).toContain('AB')
  })
})
