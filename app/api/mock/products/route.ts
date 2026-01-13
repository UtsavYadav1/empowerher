import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

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

    // Validate required fields
    if (!title || !description || !category || !price || !stock || !sellerId || !village) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Process images to ensure JSON array format
    let imageArray = []
    if (images) {
      if (typeof images === 'string') {
        try {
          imageArray = JSON.parse(images)
        } catch (e) {
          imageArray = [images]
        }
      } else if (Array.isArray(images)) {
        imageArray = images
      }
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        category,
        images: imageArray, // Prisma handles Json type
        price: parseFloat(price),
        stock: parseInt(stock),
        sellerId: parseInt(sellerId),
        village,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product listed successfully!',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create product',
      },
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

    // Handle images update
    if (updateData.images) {
      if (typeof updateData.images === 'string') {
        try {
          updateData.images = JSON.parse(updateData.images)
        } catch (e) {
          updateData.images = [updateData.images]
        }
      }
    }

    // Convert numeric fields if present strings
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
      message: 'Product updated successfully!',
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully!',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

