import { describe, it, expect, vi } from 'vitest'
import Footer from './Footer.vue'
import { shallowMount } from '@vue/test-utils'


vi.mock(import('@inertiajs/vue3'), async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    usePage: vi.fn().mockReturnValue({
      props: {
        settings: {
          companyName: 'Forclaz Motorepuestos',
          companyAddress: '9 de Julio 1429',
          companyCity: 'Concepción del Uruguay',
          companyProvince: 'Entre Ríos',
          companyZipCode: '3260',
          companyPhone: '03442-445594',
          companyEmail: 'mostradorforclaz@gmail.com',
          whatsapp: '+5493442484584'
        }
      }
    })
  }
})

describe('Footer', () => {
  it('should render footer', () => {
    const wrapper = shallowMount(Footer)

    expect(wrapper.text()).toContain('Forclaz Motorepuestos')
    expect(wrapper.text()).toContain('9 de Julio 1429')
    expect(wrapper.text()).toContain('Concepción del Uruguay')
    expect(wrapper.text()).toContain('Entre Ríos')
    expect(wrapper.text()).toContain('03442-445594')
    expect(wrapper.text()).toContain('mostradorforclaz@gmail.com')
  })
})
