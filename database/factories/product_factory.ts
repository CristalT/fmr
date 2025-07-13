import factory from '@adonisjs/lucid/factories'
import Product from '#models/product'

export const ProductFactory = factory
  .define(Product, async ({ faker }) => {
    return {
      id: faker.string.alphanumeric(20),
      provider: faker.string.alpha(3),
      name: faker.commerce.productName(),
      code: faker.string.numeric(10),
      price: Number(faker.commerce.price()),
      stock: faker.number.int({ min: 0, max: 100 })
    }
  })
  .build()
