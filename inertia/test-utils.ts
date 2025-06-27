import { createWrapperError, VueWrapper } from "@vue/test-utils"

// find element by text
export function findByText(wrapper: VueWrapper<any>, text: string) {
  return wrapper.findAll('button').find((el) => el.text() === text) ?? createWrapperError<VueWrapper>('DOMWrapper')
}
