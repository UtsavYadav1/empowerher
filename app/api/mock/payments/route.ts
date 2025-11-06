import { NextRequest, NextResponse } from 'next/server'

// POST - Process payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, method, orderId, upiId, phone } = body

    if (!amount || !method || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate payment method
    const validMethods = ['upi', 'cod', 'agent', 'cash_to_agent']
    const methodLower = method.toLowerCase()
    const normalizedMethod = methodLower === 'cash_to_agent' ? 'agent' : methodLower
    if (!validMethods.includes(methodLower)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Random success/failure (50/50)
    const isSuccess = Math.random() > 0.5

    if (isSuccess) {
      // Generate mock transaction ID
      const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`

      return NextResponse.json({
        success: true,
        data: {
          transactionId,
          amount,
          method: normalizedMethod,
          orderId,
          status: 'success',
          message: getSuccessMessage(normalizedMethod),
          timestamp: new Date().toISOString(),
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        error: getErrorMessage(normalizedMethod),
        data: {
          transactionId: null,
          amount,
          method: normalizedMethod,
          orderId,
          status: 'failed',
          timestamp: new Date().toISOString(),
        },
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}

function getSuccessMessage(method: string): string {
  switch (method.toLowerCase()) {
    case 'upi':
      return 'UPI payment successful!'
    case 'cod':
      return 'Order confirmed! Pay on delivery.'
    case 'agent':
    case 'cash_to_agent':
      return 'Order confirmed! Pay cash to field agent on delivery.'
    default:
      return 'Payment successful!'
  }
}

function getErrorMessage(method: string): string {
  switch (method.toLowerCase()) {
    case 'upi':
      return 'UPI payment failed. Please try again or use another payment method.'
    case 'cod':
      return 'COD order confirmation failed. Please try again.'
    case 'agent':
    case 'cash_to_agent':
      return 'Order confirmation failed. Please try again.'
    default:
      return 'Payment failed. Please try again.'
  }
}

// GET - Get payment methods
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      methods: [
        {
          id: 'upi',
          name: 'UPI',
          description: 'Pay via UPI (PhonePe, Google Pay, Paytm)',
          icon: '💳',
        },
        {
          id: 'cod',
          name: 'Cash on Delivery',
          description: 'Pay when your order is delivered',
          icon: '💵',
        },
        {
          id: 'cash_to_agent',
          name: 'Cash to Agent',
          description: 'Pay cash to field agent on delivery',
          icon: '👤',
        },
      ],
    },
  })
}

