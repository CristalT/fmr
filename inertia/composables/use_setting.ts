import { computed } from "vue"
import { usePage } from "@inertiajs/vue3"
import type Setting from "#models/setting"
import http from "~/shared/http"
import { useMutation } from "@tanstack/vue-query"

type PublicSettings = {
  whatsapp: string
  companyName: string
  companyAddress: string
  companyCity: string
  companyProvince: string
  companyZipCode: string
  companyPhone: string
  companyEmail: string
}


export default function useSetting() {
  const page = usePage()
  const props = (page.props as unknown as { settings: PublicSettings })

  const settings = computed(() => props.settings)

  const update = useMutation({
    mutationFn: ({ value, id }: Setting) => http(`/admin/settings/${id}`).cancellable(`update_setting_${id}`).patch({ value: value.trim() })
  })

  return { settings, update }
}
