import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// GET - List all tutorials
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const userId = searchParams.get('userId') // Optional: to check progress for this user

    const where: any = {}
    if (category && category !== 'all') {
      where.category = category
    }

    const tutorials = await prisma.tutorial.findMany({
      where,
      orderBy: { id: 'asc' },
      include: {
        progress: userId ? {
          where: { userId: parseInt(userId) }
        } : false
      }
    })

    // Map tutorials to include watched status based on user specific data
    const enhancedTutorials = tutorials.map((tutorial: any) => ({
      ...tutorial,
      watched: userId ? tutorial.progress.length > 0 && tutorial.progress[0].watched : false,
      progress: undefined // Remove internal relation data
    }))

    return NextResponse.json({
      success: true,
      data: enhancedTutorials,
      count: enhancedTutorials.length,
    })
  } catch (error) {
    console.error('Error fetching tutorials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tutorials' },
      { status: 500 }
    )
  }
}

// PATCH - Mark tutorial as watched (User Specific)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { tutorialId, watched, userId } = body

    if (!tutorialId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Tutorial ID and User ID are required' },
        { status: 400 }
      )
    }

    await prisma.tutorialProgress.upsert({
      where: {
        tutorialId_userId: {
          tutorialId: parseInt(tutorialId),
          userId: parseInt(userId)
        }
      },
      create: {
        tutorialId: parseInt(tutorialId),
        userId: parseInt(userId),
        watched: !!watched
      },
      update: {
        watched: !!watched
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully'
    })
  } catch (error) {
    console.error('Error updating tutorial progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tutorial progress' },
      { status: 500 }
    )
  }
}

