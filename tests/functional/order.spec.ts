import { CartItemFactory } from '#database/factories/cart_item_factory'
import { CustomerFactory } from '#database/factories/customer_factory'
import { OrderFactory } from '#database/factories/order_factory'
import { OrderStatus } from '#types/order_status'
import { test } from '@japa/runner'

test.group('Order', () => {
  test('create order', async ({ client }) => {
    const customer = await CustomerFactory.create()
    const items = await CartItemFactory.with('product', 3)
      .merge({
        customerId: customer.id,
        status: OrderStatus.InCart,
      })
      .createMany(3)

    const response = await client.post('orders').loginAs(customer).form({})

    response.assertStatus(201)
    response.assertBodyContains({
      customerId: customer.id,
      cartItems: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        status: OrderStatus.Pending,
        productId: item.productId,
      })),
    })
  })

  test('get customer orders', async ({ client }) => {
    const customer = await CustomerFactory.create()

    const order = await OrderFactory.merge({
      customerId: customer.id,
      status: OrderStatus.Pending,
    }).create()

    const response = await client.get('/orders').loginAs(customer).withInertia()

    response.assertStatus(200)
    response.assertInertiaPropsContains({
      data: {
        data: [
          {
            id: order.id,
            status: 'pending',
            cartItems: [],
          },
        ],
      },
    })
  })

  test('get customer orders as unauthenticated user', async ({ client }) => {
    const customer = await CustomerFactory.create()

    await OrderFactory.merge({
      customerId: customer.id,
      status: OrderStatus.Pending,
    }).create()

    const response = await client.get('/orders').withInertia()

    response.assertRedirectsTo('/auth/customers')
  })
})
