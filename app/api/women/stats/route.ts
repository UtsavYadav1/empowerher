import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get stats for a specific woman entrepreneur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    // Get all products for this seller
    const products = await prisma.product.findMany({
      where: { sellerId: parseInt(sellerId) },
    })

    // Get all orders
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Calculate stats
    let totalRevenue = 0
    let totalOrders = 0
    const productIds = products.map(p => p.id)

    // Filter orders that contain products from this seller
    orders.forEach((order) => {
      try {
        const items = typeof order.items === 'string' 
          ? JSON.parse(order.items) 
          : order.items

        if (Array.isArray(items)) {
          const hasSellerProducts = items.some((item: any) => 
            productIds.includes(item.productId)
          )

          if (hasSellerProducts) {
            totalOrders++
            // Calculate revenue only from this seller's products in the order
            items.forEach((item: any) => {
              if (productIds.includes(item.productId)) {
                totalRevenue += (item.price || 0) * (item.quantity || 0)
              }
            })
          }
        }
      } catch (error) {
        console.error('Error parsing order items:', error)
      }
    })

    // Get unique customers who ordered from this seller
    const customerIds = new Set<number>()
    orders.forEach((order) => {
      try {
        const items = typeof order.items === 'string' 
          ? JSON.parse(order.items) 
          : order.items

        if (Array.isArray(items)) {
          const hasSellerProducts = items.some((item: any) => 
            productIds.includes(item.productId)
          )

          if (hasSellerProducts) {
            customerIds.add(order.customerId)
          }
        }
      } catch (error) {
        console.error('Error parsing order items:', error)
      }
    })

    // Calculate growth (mock for now - would need historical data)
    const revenueGrowth = totalRevenue > 0 ? Math.random() * 20 : 0
    const ordersGrowth = totalOrders > 0 ? Math.random() * 15 : 0

    return NextResponse.json({
      success: true,
      data: {
        revenue: totalRevenue,
        orders: totalOrders,
        products: products.length,
        customers: customerIds.size,
        revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
        ordersGrowth: parseFloat(ordersGrowth.toFixed(1)),
      },
    })
  } catch (error) {
    console.error('Error fetching women stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
