import { computed, ModelRef, Ref } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'
import { useQuery } from '@tanstack/vue-query'
import http from '~/shared/http'
import type Customer from '#models/customer'
import type Order from '#models/order'
import { Meta } from '~/types/metadata'

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
  paymentOnDelivery: false,
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

  const fetchOptions = () => {
    return useQuery({
      queryKey: ['customer_options'],
      select: (data) => data.map((customer) => ({ label: customer.fullName, value: customer.id })),
      queryFn: async () =>
        http('admin/customers').cancellable('fetch_customers_list').get<Customer[]>('data.data'),
    })
  }

  const fetchOrders = (
    customerId: ModelRef<number | string>,
    query: Ref<{ page: number; limit: number }>,
    options: Record<string, any> = {}
  ) => {
    return useQuery({
      queryKey: ['customer_orders', customerId, query],
      queryFn: async () =>
        http(`admin/customers/${customerId.value}/orders`)
          .query(query.value)
          .cancellable('fetch_customer_orders')
          .get<{ meta: Meta; data: Order[] }>('data'),
      ...options,
    })
  }

  return { isLoggedIn, userId, fullName, form, fetchOptions, fetchOrders }
}
