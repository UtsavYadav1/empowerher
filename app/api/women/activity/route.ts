import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get recent activity for a seller
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    const sellerIdNum = parseInt(sellerId)

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        items: {
          // Filter orders that contain products from this seller
          // Note: Since items is JSON, we need to get all orders and filter
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    // Filter orders that contain this seller's products
    const sellerOrders = recentOrders.filter((order: any) => {
      try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        return Array.isArray(items) && items.some((item: any) => item.sellerId === sellerIdNum)
      } catch {
        return false
      }
    })

    // Get seller's products for view tracking (we'll simulate views based on product count)
    const products = await prisma.product.findMany({
      where: {
        sellerId: sellerIdNum,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    // Get recent customers (users who placed orders)
    const recentCustomers = await prisma.user.findMany({
      where: {
        role: 'customer',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    // Build activity array
    const activities: any[] = []

    // Add recent orders
    sellerOrders.slice(0, 3).forEach((order: any) => {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      const sellerItems = items.filter((item: any) => item.sellerId === sellerIdNum)
      const totalAmount = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

      activities.push({
        id: `order-${order.id}`,
        type: 'sale',
        message: `New order received - ${sellerItems.length} item(s)`,
        amount: Math.round(totalAmount),
        timestamp: order.createdAt,
      })
    })

    // Add product view activity (simulated based on recent products)
    if (products.length > 0) {
      // Simulate view count based on product age
      const recentProduct = products[0]
      const daysSinceCreated = Math.floor((Date.now() - new Date(recentProduct.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      const estimatedViews = Math.max(5, Math.min(50, 15 + Math.floor(Math.random() * 20)))

      activities.push({
        id: `view-${recentProduct.id}`,
        type: 'product',
        message: `${recentProduct.title} viewed ${estimatedViews} times`,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
      })
    }

    // Add new customer activity
    if (recentCustomers.length > 0) {
      const recentCustomer = recentCustomers[0]
      activities.push({
        id: `customer-${recentCustomer.id}`,
        type: 'customer',
        message: `New customer: ${recentCustomer.name}`,
        timestamp: recentCustomer.createdAt,
      })
    }

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Take top 5 activities
    const topActivities = activities.slice(0, 5)

    return NextResponse.json({
      success: true,
      data: topActivities,
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}
