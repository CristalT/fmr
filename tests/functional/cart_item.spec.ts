import { AdministratorFactory } from '#database/factories/admin_factory'
import { CartItemFactory } from '#database/factories/cart_item_factory'
import { CustomerFactory } from '#database/factories/customer_factory'
import { OrderFactory } from '#database/factories/order_factory'
import { ProductFactory } from '#database/factories/product_factory'
import { OrderStatus } from '#types/order_status'
import { test } from '@japa/runner'

test.group('Cart item create', () => {
  test('unauthorized user cannot add items to cart', async ({ client }) => {
    const product = await ProductFactory.create()
    const response = await client.post('/cart-items').form({ id: product.id, quantity: 1 })
    response.assertRedirectsTo('/auth/customers')
  })

  test('customer user adds an item to its cart', async ({ client }) => {
    const customer = await CustomerFactory.create()

    const product = await ProductFactory.create()

    const createResponse = await client.post('/cart-items').loginAs(customer).form({
      id: product.id,
      quantity: 1,
    })

    createResponse.assertCreated()
  })

  test('list current user cart items', async ({ client }) => {
    const customer = await CustomerFactory.create()
    const items = await CartItemFactory.with('product', 3)
      .merge({
        customerId: customer.id,
        status: OrderStatus.InCart,
      })
      .createMany(3)
    const response = await client.get('/cart-items').loginAs(customer)
    response.assertStatus(200)
    response.assertBodyContains(
      items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        delivered: 0,
        orderId: null,
        status: OrderStatus.InCart,
        productId: item.productId,
        product: {
          id: item.product.id,
          code: item.product.code,
          provider: item.product.provider,
          name: item.product.name,
          price: item.product.price,
          image: null,
        },
      }))
    )
  })

  test('cannot add the same product twice to the cart', async ({ client }) => {
    const customer = await CustomerFactory.create()
    const item = await CartItemFactory.with('product')
      .merge({
        customerId: customer.id,
        status: OrderStatus.InCart,
      })
      .create()

    const response = await client.post('/cart-items').loginAs(customer).form({
      id: item.product.id,
      quantity: 1,
    })

    response.assertConflict()
  })

  test('cannot list orders of another user', async ({ client }) => {
    const customer = await CustomerFactory.create()
    const otherCustomer = await CustomerFactory.create()
    await CartItemFactory.with('product')
      .merge({
        customerId: otherCustomer.id,
        status: OrderStatus.InCart,
      })
      .create()

    const response = await client.get('/cart-items').loginAs(customer)
    response.assertStatus(200)
    response.assertBody([])
  })

  test('current cart list only items with status InCart', async ({ client }) => {
    const customer = await CustomerFactory.create()
    const items = await CartItemFactory.with('product', 3)
      .merge({
        customerId: customer.id,
        status: OrderStatus.InCart,
      })
      .createMany(3)

    await CartItemFactory.with('product', 2)
      .merge({
        customerId: customer.id,
        status: OrderStatus.Delivered,
      })
      .createMany(2)

    const response = await client.get('/cart-items').loginAs(customer)
    response.assertStatus(200)
    response.assertBodyContains(
      items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        delivered: 0,
        orderId: null,
        status: OrderStatus.InCart,
        productId: item.productId,
        product: {
          id: item.product.id,
          code: item.product.code,
          provider: item.product.provider,
          name: item.product.name,
          price: item.product.price,
          image: null,
        },
      }))
    )
  })

  test('update cart item quantity as customer user', async ({ client }) => {
    const customer = await CustomerFactory.create()
    const item = await CartItemFactory.with('product')
      .merge({
        customerId: customer.id,
        status: OrderStatus.InCart,
      })
      .create()
    const response = await client.put(`/cart-items/${item.id}`).loginAs(customer).form({
      quantity: 2,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      id: item.id,
      quantity: '2',
      delivered: 0,
      orderId: null,
      customerId: customer.id,
      status: OrderStatus.InCart,
      productId: item.productId,
    })
  })

  test('update cart item delivered field as admin user', async ({ client }) => {
    const admin = await AdministratorFactory.create()
    const customer = await CustomerFactory.create()
    const order = await OrderFactory.create()
    const item = await CartItemFactory.with('product')
      .merge({
        customerId: customer.id,
        status: OrderStatus.InCart,
        orderId: order.id,
      })
      .create()

    const response = await client
      .put(`/cart-items/${item.id}?orderId=${order.id}`)
      .withGuard('admin')
      .loginAs(admin)
      .form({
        delivered: 1,
      })

    response.assertStatus(200)
    response.assertBodyContains({
      id: item.id,
      quantity: item.quantity,
      delivered: '1',
      orderId: String(order.id),
      customerId: customer.id,
      status: OrderStatus.InCart,
      productId: item.productId,
    })
  })
})
