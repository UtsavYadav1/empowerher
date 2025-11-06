import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const village = searchParams.get('village')

    const where: any = {}
    if (category) where.category = category
    if (village) where.village = village

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, images, price, stock, sellerId, village } = body

    if (!title || !description || !category || !price || !stock || !sellerId || !village) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        category,
        images: typeof images === 'string' ? JSON.parse(images) : images,
        price: parseFloat(price),
        stock: parseInt(stock),
        sellerId: parseInt(sellerId),
        village,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PATCH - Update a product
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Ensure images is in correct format for Json type
    if (updateData.images && typeof updateData.images === 'string') {
      updateData.images = JSON.parse(updateData.images)
    }

    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price)
    if (updateData.stock) updateData.stock = parseInt(updateData.stock)
    if (updateData.sellerId) updateData.sellerId = parseInt(updateData.sellerId)

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

