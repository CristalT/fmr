import { createWrapperError, VueWrapper } from '@vue/test-utils'

// find element by text
export function findByText(wrapper: VueWrapper<any>, text: string, selector: string = '*') {
  return (
    wrapper.findAll(selector).find((el) => el.text() === text) ??
    createWrapperError<VueWrapper>('DOMWrapper')
  )
}
