import { Resend } from 'resend'
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants'
import { Order } from '@/types'
import PurchaseEmailEmail from './purchase-receipt'
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: 'janagaprobert@gmail.com',
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseEmailEmail order={order} />
  })
}
