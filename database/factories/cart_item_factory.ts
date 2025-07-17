import factory from '@adonisjs/lucid/factories'
import CartItem from '#models/cart_item'
import { ProductFactory } from './product_factory.js'
import { OrderStatus } from '#types/order_status'

export const CartItemFactory = factory
  .define(CartItem, async () => {
    return {
      quantity: 1,
      status: OrderStatus.InCart,
    }
  })
  .relation('product', () => ProductFactory)
  .build()
