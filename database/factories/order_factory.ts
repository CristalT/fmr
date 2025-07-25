import factory from '@adonisjs/lucid/factories'
import Order from '#models/order'
import { CartItemFactory } from './cart_item_factory.js'

export const OrderFactory = factory
  .define(Order, () => {
    return {}
  })
  .relation('cartItems', () => CartItemFactory)
  .build()
