import { type ZodTypeAny } from 'zod'
import { z } from '~/shared/es_zod'
import { ref, watch, toValue, type MaybeRefOrGetter } from 'vue'
import { groupBy, get } from 'lodash-es'

export default function <
  T extends ZodTypeAny,
  U = Record<string, unknown>,
  V = Record<string, z.ZodIssue[]>,
>(schema: T, data: MaybeRefOrGetter<U>) {
  const isValid = ref(true)

  let unwatch: null | (() => void) = null

  const errors = ref<V | null>(null)

  const clearErrors = () => {
    errors.value = null
  }

  const validationWatch = () => {
    if (unwatch !== null) {
      return
    }

    unwatch = watch(
      () => toValue(data),
      async () => {
        await validate()
      },
      { deep: true }
    )
  }

  const validate = async () => {
    clearErrors()

    const result = await schema.safeParseAsync(toValue(data))

    isValid.value = result.success

    if (!result.success) {
      errors.value = groupBy(result.error.issues, 'path')
      validationWatch()
    }

    return errors
  }

  const scrolltoError = (selector = '.is-error', options = { offset: 0 }) => {
    const element = document.querySelector(selector)

    if (element) {
      const topOffset =
        element.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        options.offset

      window.scrollTo({
        behavior: 'smooth',
        top: topOffset,
      })
    }
  }

  const getError = (path: string) => get(errors.value, `${path.replaceAll('.', ',')}.0.message`)

  return { validate, errors, isValid, clearErrors, getError, scrolltoError }
}
