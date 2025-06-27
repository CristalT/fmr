import { describe, it, expect } from 'vitest'
import SavingIndicator from './SavingIndicator.vue'
import { shallowMount } from '@vue/test-utils'

describe('SavingIndicator', () => {
  it('should render saving state', () => {
    const wrapper = shallowMount(SavingIndicator, {
      props: {
        isSaving: true,
        isSaved: false,
        isError: false
      }
    })
    expect(wrapper.text()).toBe('Guardando ...')
  })

  it('should render saved state', () => {
    const wrapper = shallowMount(SavingIndicator, {
      props: {
        isSaving: false,
        isSaved: true,
        isError: false
      }
    })
    expect(wrapper.text()).toBe('Guardado')
  })

  it('should render error state', () => {
    const wrapper = shallowMount(SavingIndicator, {
      props: {
        isSaving: false,
        isSaved: false,
        isError: true
      }
    })
    expect(wrapper.text()).toBe('Error al guardar')
  })
})
