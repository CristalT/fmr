import type Order from '#models/order'
import { OrderStatus } from '#types/order_status'
import { router } from '@inertiajs/vue3'
import { computed } from 'vue'
import { useToast, useConfirm } from '~/composables'
import http from '~/shared/http'

export default function useOrder(order: Order) {
  const { toast } = useToast()
  const { confirmation } = useConfirm()

  const customerFullName = computed(() => {
    return `${order.customer.firstName} ${order.customer.lastName}`
  })

  const total = computed(() =>
    Math.round(order.cartItems.reduce((acc, item) => acc + item.product.price * item.delivered, 0))
  )

  const asked = computed(() => order.cartItems.reduce((acc, item) => acc + item.quantity, 0))
  const delivered = computed(() => order.cartItems.reduce((acc, item) => acc + item.delivered, 0))
  const pending = computed(() => asked.value - delivered.value)

  async function destroy() {
    const isConfirmed = await confirmation({
      title: 'Eliminar Pedido',
      type: 'danger',
      message: 'Está por eliminar el pedido de manera permanente. La siguiente acción es irreversible. ¿Desea continuar?',
      confirm: 'Eliminar',
      cancel: 'Cancelar'
    })

    if (!isConfirmed) return;

    http('admin/orders')
      .delete(order.id)
      .then(() => {
        router.visit(`/admin/orders`)
      })
      .catch((error) => {
        toast.error('Error al eliminar el pedido')
        console.error('Failed to delete order:', error)
      })
  }

  async function setStatus(status: OrderStatus) {
    const oldStatus = order.status
    return http(`admin/orders/${order.id}`)
      .patch({ status })
      .then(() => {
        router.visit(`/admin/orders/${order.id}`)
      })
      .catch((error) => {
        order.status = oldStatus // Revert to old status on error
        toast.error('Error al cambiar el estado del pedido')
        console.error('Failed to update order status:', error)
      })
  }

  return { customerFullName, setStatus, destroy, total, asked, delivered, pending }
}
