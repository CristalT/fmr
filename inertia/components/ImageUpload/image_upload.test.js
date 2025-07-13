import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { usePath } from '~/composables'
import ImageUpload from './ImageUpload.vue'


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

  it('hides delete icon if it has not something to delete', async () => {
    const wrapper = mount(ImageUpload, {
      props: { product: {} },
    })

    const actions = wrapper.findAllComponents({ name: 'Icon' })

    expect(actions.length).toBe(1)
    expect(actions.at(0).props('name')).not.toBe('delete')
  })

  it('shows delete icon if it has something deletable', async () => {
    const wrapper = mount(ImageUpload, {
      props: { product: { image: 'imgString' } },
    })

    const actions = wrapper.findAllComponents({ name: 'Icon' })

    expect(actions.length).toBe(2)
    expect(actions.map((action) => action.props('name'))).toContain('delete')
  })

  it('shows a confirmation dialog when trying to delete an image', async () => {
    const confirmation = vi.hoisted(() => vi.fn().mockResolvedValue(true))
    // Mock the useConfirm composable
    vi.mock('~/composables', async (importOriginal) => {
      const actual = await importOriginal()
      return {
      ...actual,
      useConfirm: () => ({
        confirmation,
      }),
      }
    })

    const wrapper = mount(ImageUpload, {
      props: { product: { image: 'imgString' } },
    })

    // Find the delete icon and trigger a click
    const actions = wrapper.findAllComponents({ name: 'Icon' })
    const deleteIcon = actions.find(action => action.props('name') === 'delete')
    await deleteIcon.trigger('click')

    // Expect the composable's confirm dialog to have been called
    expect(confirmation).toHaveBeenCalled()
  })
})
