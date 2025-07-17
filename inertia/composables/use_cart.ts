import { computed, shallowRef, toValue } from 'vue'
import http from '~/shared/http'
import type CartItem from '#models/cart_item'
import type Product from '#models/product'

const items = shallowRef<CartItem[]>([])

export default function useCart() {
  async function getItems(): Promise<CartItem[]> {
    const { data } = await http('cart-items').get<{ data: CartItem[] }>()
    items.value = data
    return items.value
  }

  async function add(item: Product, qty: number) {
    return http('cart-items')
      .post({
        id: item.id,
        quantity: qty,
        code: item.code,
        name: item.name,
      })
      .then(() => {
        getItems()
      })
  }

  async function update(item: CartItem, quantity: number) {
    return http(`cart-items/${item.id}`).patch({ quantity })
  }

  async function remove(item: CartItem) {
    return http('cart-items')
      .delete(item.id)
      .then(() => {
        getItems()
      })
  }

  const length = computed<number>(() => items.value.length)

  return { items, add, update, remove, length, getItems }
}
