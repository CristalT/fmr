import { describe, it, expect } from 'vitest'
import WhatsApp from './WhatsApp.vue'
import { shallowMount } from '@vue/test-utils'

describe('WhatsApp', () => {
  it('should render whatsapp', () => {
    const wrapper = shallowMount(WhatsApp, { props: { phone: '+5493442484584' } })

    const link = wrapper.find('a')

    expect(link.attributes('href')).toContain('https://wa.me/+5493442484584')
  })
})
