import { computed } from "vue"
import { usePage } from "@inertiajs/vue3"


export default function useCustomer() {
  const page = usePage()
  const isLoggedIn = computed(() => (page.props as unknown as { auth: { isCustomerLoggedIn: boolean } }).auth.isCustomerLoggedIn)
  const userId = computed(() => (page.props as unknown as { auth: { userId: number } }).auth.userId)

  return { isLoggedIn, userId }
}
