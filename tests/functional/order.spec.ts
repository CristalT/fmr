import { CartItemFactory } from '#database/factories/cart_item_factory'
import { CustomerFactory } from '#database/factories/customer_factory'
import { OrderFactory } from '#database/factories/order_factory'
import Order from '#models/order'
import { OrderStatus } from '#types/order_status'
import { test } from '@japa/runner'

test.group('Order', () => {
  test('create order and redirects to show order if customer has the payment on delivery agree', async ({
    client,
  }) => {
    const customer = await CustomerFactory.merge({ paymentOnDelivery: true }).create()

    await CartItemFactory.with('product', 3)
      .merge({
        customerId: customer.id,
        status: OrderStatus.InCart,
      })
      .createMany(3)

    const response = await client.post('orders').withInertia().loginAs(customer).form({})

    const createdOrder = await Order.query()
      .where('customerId', customer.id)
      .orderBy('id', 'desc')
      .firstOrFail()

    response.assertRedirectsTo(`/orders/${createdOrder.id}`)
  })

  test('create order and redirect to payment pipeline if customer has not the payment on delivery agree', async ({
    client,
  }) => {
    const customer = await CustomerFactory.create()

    await CartItemFactory.with('product', 3)
      .merge({
        customerId: customer.id,
        status: OrderStatus.InCart,
      })
      .createMany(3)

    const response = await client.post('orders').withInertia().loginAs(customer).form({})

    const createdOrder = await Order.query()
      .where('customerId', customer.id)
      .orderBy('id', 'desc')
      .firstOrFail()

    response.assertRedirectsTo(`/orders/${createdOrder.id}/edit`)
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
