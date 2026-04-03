import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { usePath } from '~/composables'
import ImageUpload from './ImageUpload.vue'

const confirmation = vi.hoisted(() => vi.fn().mockResolvedValue(true))

vi.mock('~/composables', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useConfirm: () => ({ confirmation }),
  }
})

describe('ImageUpload', () => {
  let wrapper

  beforeEach(() => {
    confirmation.mockClear()
    confirmation.mockResolvedValue(true)
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders a placeholder image when no image is present', () => {
    const { staticPath } = usePath()
    wrapper = mount(ImageUpload, {
      props: {
        product: {},
      },
    })

    const img = wrapper.findAll('img')

    expect(img.at(1).attributes('src')).toBe(staticPath('image-placeholder.webp'))
  })

  it('hides delete icon if it has not something to delete', async () => {
    wrapper = mount(ImageUpload, {
      props: { product: {} },
    })

    const actions = wrapper.findAllComponents({ name: 'Icon' })

    expect(actions.length).toBe(2) // edit + paste hint
    expect(actions.map((a) => a.props('name'))).not.toContain('delete')
  })

  it('shows delete icon if it has something deletable', async () => {
    wrapper = mount(ImageUpload, {
      props: { product: { image: 'imgString' } },
    })

    const actions = wrapper.findAllComponents({ name: 'Icon' })

    expect(actions.length).toBe(3) // edit + delete + paste hint
    expect(actions.map((action) => action.props('name'))).toContain('delete')
  })

  it('shows a confirmation dialog when trying to delete an image', async () => {
    wrapper = mount(ImageUpload, {
      props: { product: { image: 'imgString' } },
    })

    const actions = wrapper.findAllComponents({ name: 'Icon' })
    const deleteIcon = actions.find((action) => action.props('name') === 'delete')
    await deleteIcon.trigger('click')

    expect(confirmation).toHaveBeenCalled()
  })

  it('pastes image without confirmation when no image is present', async () => {
    wrapper = mount(ImageUpload, {
      props: { product: {} },
    })

    const file = new File(['img'], 'paste.png', { type: 'image/png' })
    const pasteEvent = new Event('paste')
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }] },
    })

    window.dispatchEvent(pasteEvent)
    await flushPromises()

    expect(confirmation).not.toHaveBeenCalled()
  })

  it('shows confirmation before replacing existing image on paste', async () => {
    wrapper = mount(ImageUpload, {
      props: { product: { image: 'existing.jpg' } },
    })

    const file = new File(['img'], 'paste.png', { type: 'image/png' })
    const pasteEvent = new Event('paste')
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }] },
    })

    window.dispatchEvent(pasteEvent)
    await flushPromises()

    expect(confirmation).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Reemplazar imagen' })
    )
  })
})
