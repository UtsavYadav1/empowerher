import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List orders (optionally filtered by customer)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')

    const where: any = {}
    if (customerId) {
      where.customerId = parseInt(customerId)
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, items, total, status = 'pending' } = body

    if (!customerId || !items || !total) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId: parseInt(customerId),
        items: typeof items === 'string' ? items : JSON.stringify(items),
        total: parseFloat(total),
        status,
      },
    })

    // Update product stock for each item
    try {
      const orderItems = typeof items === 'string' ? JSON.parse(items) : items
      if (Array.isArray(orderItems)) {
        for (const item of orderItems) {
          if (item.productId && item.quantity) {
            const product = await prisma.product.findUnique({
              where: { id: parseInt(item.productId) },
            })

            if (product && product.stock >= item.quantity) {
              await prisma.product.update({
                where: { id: parseInt(item.productId) },
                data: {
                  stock: product.stock - item.quantity,
                },
              })
            }
          }
        }
      }
    } catch (stockError) {
      console.error('Error updating stock:', stockError)
      // Don't fail the order if stock update fails
    }

    return NextResponse.json({
      success: true,
      data: order,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

