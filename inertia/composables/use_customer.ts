import { computed } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'

const form = useForm({
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
})

export default function useCustomer() {
  const page = usePage()
  const props = page.props as unknown as {
    auth: {
      isCustomerLoggedIn: boolean
      isAdminLoggedIn: boolean
      userId: number
      userFullName: string
    }
  }

  const fullName = computed(() => props.auth.userFullName)
  const isLoggedIn = computed(() => props.auth.isCustomerLoggedIn)
  const userId = computed(() => props.auth.userId)

  return { isLoggedIn, userId, fullName, form }
}
