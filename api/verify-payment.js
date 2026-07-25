import crypto from 'crypto'

export default async function handler(req, res) {
  // Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}

    // Missing fields check
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required Razorpay payment verification parameters' })
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_secret) {
      return res.status(401).json({ error: 'Razorpay Key Secret not configured on server' })
    }

    // HMAC-SHA256 signature verification
    const hmac = crypto.createHmac('sha256', key_secret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const generated_signature = hmac.digest('hex')

    if (generated_signature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      })
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature mismatch',
      })
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return res.status(500).json({
      error: 'Failed to verify Razorpay payment',
      details: error.message || String(error),
    })
  }
}
