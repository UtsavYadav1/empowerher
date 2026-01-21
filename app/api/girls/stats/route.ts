import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userIdQuery = searchParams.get('userId')

    let stats = {
      enrolled: 0,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      schemesApplied: 0,
      certificates: 0,
    }

    let recentCourses: any[] = []
    let chartData: any[] = [
      { month: 'Aug', progress: 0 },
      { month: 'Sep', progress: 0 },
      { month: 'Oct', progress: 0 },
      { month: 'Nov', progress: 0 },
      { month: 'Dec', progress: 0 },
      { month: 'Jan', progress: 0 },
    ]

    if (userIdQuery) {
      const userId = parseInt(userIdQuery)

      // Fetch Stats
      const completedCourses = await prisma.tutorialProgress.count({
        where: { userId, watched: true }
      })

      const inProgressCourses = await prisma.tutorialProgress.count({
        where: { userId, watched: false }
      })

      const schemesApplied = await prisma.userScheme.count({
        where: { userId }
      })

      const certificates = completedCourses

      stats = {
        enrolled: completedCourses + inProgressCourses,
        completed: completedCourses,
        inProgress: inProgressCourses,
        notStarted: 0,
        schemesApplied: schemesApplied,
        certificates: certificates,
      }

      // Fetch recent courses (progress)
      const recentProgress = await prisma.tutorialProgress.findMany({
        where: { userId },
        take: 4,
        orderBy: { updatedAt: 'desc' },
        include: {
          tutorial: true
        }
      })

      recentCourses = recentProgress.map((p: any) => ({
        id: p.tutorial.id,
        title: p.tutorial.title,
        category: p.tutorial.category,
        progress: p.watched ? 100 : 50,
        lastAccessed: p.updatedAt,
        image: p.tutorial.youtubeId ? `https://img.youtube.com/vi/${p.tutorial.youtubeId}/mqdefault.jpg` : null
      }))

      // Calculate Chart Data dynamically
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentMonth = new Date().getMonth()

      const chartDataMap = new Map<string, number>()
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(currentMonth - i)
        // Handle negative months logic if needed, but JS Date handles setMonth(-1) correctly
        const monthIndex = d.getMonth()
        const monthName = months[monthIndex]
        chartDataMap.set(monthName, 0)
      }

      // Aggregate progress
      recentProgress.forEach((p: any) => {
        const date = new Date(p.updatedAt)
        const monthName = months[date.getMonth()]
        if (chartDataMap.has(monthName)) {
          const currentVal = chartDataMap.get(monthName) || 0
          chartDataMap.set(monthName, currentVal + (p.watched ? 20 : 10))
        }
      })

      // Aggregate schemes
      const recentSchemes = await prisma.userScheme.findMany({
        where: { userId },
        orderBy: { appliedAt: 'desc' },
        take: 20
      })

      recentSchemes.forEach((s: any) => {
        const date = new Date(s.appliedAt)
        const monthName = months[date.getMonth()]
        if (chartDataMap.has(monthName)) {
          const currentVal = chartDataMap.get(monthName) || 0
          chartDataMap.set(monthName, currentVal + 30)
        }
      })

      chartData = Array.from(chartDataMap.entries()).map(([month, progress]) => ({
        month,
        progress: Math.min(progress, 100)
      }))
    }

    return NextResponse.json({
      success: true,
      data: {
        stats,
        chartData,
        recentCourses,
      },
    })
  } catch (error) {
    console.error('Error fetching girls stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
