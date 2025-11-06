import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT - Update order (for feedback)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id)
    const body = await request.json()
    const { rating, feedback, buyerRating } = body

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order items (JSON) to include feedback
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    const updatedItems = Array.isArray(items) ? items.map((item: any) => ({
      ...item,
      rating: rating || item.rating,
      feedback: feedback || item.feedback,
      buyerRating: buyerRating || item.buyerRating,
    })) : items

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        items: JSON.stringify(updatedItems),
        status: body.status || order.status,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

