import Razorpay from 'razorpay'

export default async function handler(req, res) {
  // Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { amount = 19900, currency = 'INR', receipt } = req.body || {}
    const amountNum = Number(amount)

    // Validate amount >= 100 paise
    if (isNaN(amountNum) || amountNum < 100) {
      return res.status(400).json({ error: 'Minimum amount must be at least 100 paise (₹1)' })
    }

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_id || !key_secret) {
      return res.status(401).json({ error: 'Razorpay API credentials missing on server environment' })
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    })

    const orderReceipt = receipt || `receipt_${Date.now()}`
    const order = await instance.orders.create({
      amount: amountNum,
      currency,
      receipt: orderReceipt,
    })

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return res.status(500).json({
      error: 'Failed to create Razorpay order',
      details: error.message || String(error),
    })
  }
}
