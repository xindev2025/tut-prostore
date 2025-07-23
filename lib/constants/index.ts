export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Prostore'
export const APP_DESC =
  process.env.NEXT_PUBLIC_APP_DESC ?? 'Nextjs ecommerce website'
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
export const DATABASE_URL = process.env.DATABASE_URL ?? ''

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: ''
}

export const PAYMENT_METHOD = ['paypal', 'stripe', 'cashOnDelivery']
export const DEFAULT_PAYMENT_METHOD = 'paypal'

export const PAGE_SIZE = 2

export const productDefaultValues = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  banner: null
}

export const USER_ROLES = ['admin', 'user']
