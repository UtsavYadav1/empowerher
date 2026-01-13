import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List all finance schemes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const where: any = {}
    if (category) {
      where.category = category
    }

    const schemes = await prisma.financeScheme.findMany({
      where,
      orderBy: { id: 'asc' }, // Order by ID or creation if available
    })

    return NextResponse.json({
      success: true,
      data: schemes,
      count: schemes.length,
    })
  } catch (error) {
    console.error('Error fetching finance schemes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch finance schemes' },
      { status: 500 }
    )
  }
}

// POST - Create a new finance scheme (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, eligibility, applyUrl, amount, interestRate, category = 'business', deadline = null } = body

    if (!title || !description || !eligibility || !applyUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newScheme = await prisma.financeScheme.create({
      data: {
        title,
        description,
        eligibility,
        applyUrl,
        amount: amount || 'As per bank policy',
        interestRate: interestRate || 'Varies',
        category,
        deadline: deadline ? new Date(deadline) : null,
      }
    })

    return NextResponse.json({ success: true, data: newScheme }, { status: 201 })
  } catch (error) {
    console.error('Error creating finance scheme:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create finance scheme' },
      { status: 500 }
    )
  }
}


