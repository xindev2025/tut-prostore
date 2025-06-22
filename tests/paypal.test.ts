import { generateAccessToken } from '../lib/paypal'

// test to generate paypal access token
test('generate token from paypal', async () => {
  const tokenResponse = await generateAccessToken()
  console.log(tokenResponse)

  expect(typeof tokenResponse).toBe('string')
  expect(tokenResponse.length).toBeGreaterThan(0)
})
