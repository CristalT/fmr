import { computed, shallowRef, toValue } from 'vue'
import http from '~/shared/http'
import type CartItem from '#models/cart_item'
import type Product from '#models/product'

const items = shallowRef<CartItem[]>([])

export default function useCart() {
  async function getItems(): Promise<CartItem[]> {
    const { data } = (await http.get('cart/items')) as { data: CartItem[] }
    items.value = data
    return items.value
  }

  async function add(item: Product, qty: number) {
    return http
      .post('carts', {
        id: item.id,
        quantity: qty,
      })
      .then(() => {
        getItems()
      })
  }

  async function update(item: CartItem, qty: number) {
    return http.put(`carts/${item.id}`, {
      quantity: qty,
    })
  }

  async function remove(item: CartItem) {
    return http.delete(`carts/${item.id}`).then(() => {
      getItems()
    })
  }

  const length = toValue(
    computed<number>(() => {
      return items.value.length
    })
  )

  return { items, add, update, remove, length, getItems }
}
