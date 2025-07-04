import { computed } from "vue"
import { usePage } from "@inertiajs/vue3"


export default function useAdmin() {
  const page = usePage()
  const props = (page.props as unknown as { auth: { isAdminLoggedIn: boolean } })

  const isLoggedIn = computed(() => props.auth.isAdminLoggedIn)

  return { isLoggedIn }
}
