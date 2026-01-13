import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List all tutorials
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const where: any = {}
    if (category && category !== 'all') {
      where.category = category
    }

    const tutorials = await prisma.tutorial.findMany({
      where,
      orderBy: { id: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: tutorials,
      count: tutorials.length,
    })
  } catch (error) {
    console.error('Error fetching tutorials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tutorials' },
      { status: 500 }
    )
  }
}

// PATCH - Mark tutorial as watched
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { tutorialId, watched } = body

    if (tutorialId === undefined || watched === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const tutorial = await prisma.tutorial.update({
      where: { id: parseInt(tutorialId) },
      data: { watched },
    })

    return NextResponse.json({
      success: true,
      data: tutorial,
    })
  } catch (error) {
    console.error('Error updating tutorial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tutorial' },
      { status: 500 }
    )
  }
}

