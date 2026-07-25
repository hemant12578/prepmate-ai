export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function processRazorpayPayment({
  planName = 'PrepMate Pro',
  amountPaise = 19900, // Default ₹199 (19900 paise)
  user = null,
  onSuccess = () => {},
  onError = () => {},
}) {
  try {
    // 1. Ensure Razorpay Checkout SDK is loaded
    const isLoaded = await loadRazorpayScript()
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay Checkout SDK. Please check your internet connection.')
    }

    // 2. Call Backend API to Create Order (POST /api/create-order)
    const createRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: `receipt_${planName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      }),
    })

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}))
      throw new Error(errData.error || `Server error (${createRes.status}) while creating payment order`)
    }

    const orderData = await createRes.json()
    const { order_id, amount, currency } = orderData

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID

    // 3. Configure Razorpay Standard Checkout Modal Options
    const options = {
      key: razorpayKeyId,
      amount: amount,
      currency: currency,
      name: 'PrepMate AI',
      description: `${planName} Subscription`,
      image: '/logo.png',
      order_id: order_id,
      prefill: {
        name: user?.displayName || '',
        email: user?.email || '',
      },
      theme: {
        color: '#7c3aed', // PrepMate Purple Brand Theme
      },
      // STEP 2: On Success Handler
      handler: async function (response) {
        try {
          // Send razorpay_payment_id, razorpay_order_id, razorpay_signature to Backend Verify Endpoint
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyRes.json().catch(() => ({}))

          if (verifyRes.ok && verifyData.success) {
            onSuccess({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              planName,
            })
          } else {
            throw new Error(verifyData.error || 'Payment signature verification failed')
          }
        } catch (verifyErr) {
          console.error('Razorpay verification error:', verifyErr)
          onError(verifyErr.message || 'Payment verification failed')
        }
      },
      modal: {
        ondismiss: function () {
          onError('Payment process cancelled by user.')
        },
      },
    }

    const rzp = new window.Razorpay(options)

    // Handle payment.failed event
    rzp.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error)
      onError(response.error?.description || 'Payment failed. Please try again.')
    })

    rzp.open()
  } catch (err) {
    console.error('Razorpay Checkout initialization error:', err)
    onError(err.message || 'Could not initiate payment modal')
  }
}
