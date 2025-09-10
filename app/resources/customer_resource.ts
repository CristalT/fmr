import Customer from '#models/customer'

export default class CustomerResource {
  id: number
  email: string
  firstName: string
  lastName: string
  address: string
  address2: string
  city: string
  province: string
  postalCode: string
  phone: string

  constructor(data: Customer) {
    this.id = data.id
    this.email = data.email
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.address = data.address
    this.address2 = data.address2
    this.city = data.city
    this.province = data.province
    this.postalCode = data.postalCode
    this.phone = data.phone
  }
}
