import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

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

    const productIds = products.map(p => p.id)

    if (productIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          revenueByMonth: [],
          salesByProduct: [],
          salesByCategory: [],
        },
      })
    }

    // Get all orders containing these products
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Filter orders that contain seller's products and calculate analytics
    const relevantOrders = allOrders.filter(order => {
      try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        return Array.isArray(items) && items.some((item: any) =>
          productIds.includes(parseInt(item.productId))
        )
      } catch {
        return false
      }
    })

    // Revenue by month (last 6 months)
    const revenueByMonth = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = months[date.getMonth()]
      const year = date.getFullYear()

      const monthOrders = relevantOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
      })

      const monthRevenue = monthOrders.reduce((sum, order) => {
        try {
          const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
          const sellerItemsTotal = items
            .filter((item: any) => productIds.includes(parseInt(item.productId)))
            .reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0)
          return sum + sellerItemsTotal
        } catch {
          return sum
        }
      }, 0)

      revenueByMonth.push({
        month: monthName,
        revenue: Math.round(monthRevenue),
        orders: monthOrders.length,
      })
    }

    // Sales by product (top 5)
    const productSales: { [key: string]: number } = {}

    relevantOrders.forEach(order => {
      try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        items.forEach((item: any) => {
          const productId = parseInt(item.productId)
          if (productIds.includes(productId)) {
            const product = products.find(p => p.id === productId)
            if (product) {
              productSales[product.title] = (productSales[product.title] || 0) + item.quantity
            }
          }
        })
      } catch { }
    })

    const salesByProduct = Object.entries(productSales)
      .map(([product, sales]) => ({ product, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    // Sales by category
    const categorySales: { [key: string]: number } = {}

    relevantOrders.forEach(order => {
      try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        items.forEach((item: any) => {
          const productId = parseInt(item.productId)
          if (productIds.includes(productId)) {
            const product = products.find(p => p.id === productId)
            if (product) {
              const category = product.category || 'Others'
              categorySales[category] = (categorySales[category] || 0) + item.quantity
            }
          }
        })
      } catch { }
    })

    const salesByCategory = Object.entries(categorySales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return NextResponse.json({
      success: true,
      data: {
        revenueByMonth,
        salesByProduct,
        salesByCategory,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
