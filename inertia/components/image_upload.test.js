import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageUpload from './ImageUpload.vue'
import { usePath } from '~/composables'

describe('ImageUpload', () => {
  it('renders a placeholder image when no image is present', () => {
    const { staticPath } = usePath()
    const wrapper = mount(ImageUpload, {
      props: {
        product: {},
      },
    })

    const img = wrapper.findAll('img')

    expect(img.at(1).attributes('src')).toBe(staticPath('image-placeholder.webp'))
  })
})
