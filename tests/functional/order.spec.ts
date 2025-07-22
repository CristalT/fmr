import { CartItemFactory } from '#database/factories/cart_item_factory'
import { CustomerUserFactory } from '#database/factories/customer_user_factory'
import { OrderStatus } from '#types/order_status'
import { test } from '@japa/runner'

test.group('Order', () => {
  test('create order', async ({ client }) => {
    const customer = await CustomerUserFactory.create()
    const items = await CartItemFactory.with('product', 3)
      .merge({
        customerUserId: customer.id,
        status: OrderStatus.InCart,
      })
      .createMany(3)

    const response = await client.post('orders').loginAs(customer).form({})

    response.assertStatus(201)
    response.assertBodyContains({
      customerUserId: customer.id,
      cartItems: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        status: OrderStatus.Pending,
        productId: item.productId,
      })),
    })
  })
})
