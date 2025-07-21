import { generateAccessToken, paypal } from '../lib/paypal'

// test to generate paypal access token
test('generate token from paypal', async () => {
  const tokenResponse = await generateAccessToken()

  expect(typeof tokenResponse).toBe('string')
  expect(tokenResponse.length).toBeGreaterThan(0)
})

// test to create paypel order
test('create paypal order', async () => {
  const price = 10.0

  const orderResponse = await paypal.createOrder(price)

  expect(orderResponse).toHaveProperty('id')
  expect(orderResponse).toHaveProperty('status')
  expect(orderResponse.status).toBe('CREATED')
})

// test to capture payment with mock order
test('simulate capturing payment from an order', async () => {
  const orderId = '100'

  const mockCapturePayment = jest
    .spyOn(paypal, 'capturePayment')
    .mockResolvedValue({
      status: 'COMPLETED'
    })

  const captureResponse = await paypal.capturePayment(orderId)
  expect(captureResponse).toHaveProperty('status', 'COMPLETED')

  mockCapturePayment.mockRestore()
})
