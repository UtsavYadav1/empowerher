import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') // Expect userId to be passed or handle via session if feasible (server-side)

    // NOTE: In a real auth setup, we'd get userId from session. 
    // For now, if no userId, we default to 0 or return empty stats.
    // However, the frontend calls this without arguments usually. 
    // We'll return 0s if no user context, or fetch global stats if appropriate.
    // But this is "My Progress", so it needs user context.
    // The frontend code: `const user = getCurrentUser()` then calls fetch.
    // The fetch doesn't pass likely userId. 
    // Let's assume we return "0" for now to clear the dummy data, 
    // unless we can get the user.

    // Ideally, frontend should pass ?userId=${user.id}

    const stats = {
      enrolled: 0, // Placeholder until we link to real user
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      schemesApplied: 0, // Would query AppliedScheme model
      certificates: 0,
    }

    const chartData = [
      { month: 'Aug', progress: 0 },
      { month: 'Sep', progress: 0 },
      { month: 'Oct', progress: 0 },
      { month: 'Nov', progress: 0 },
      { month: 'Dec', progress: 0 },
      { month: 'Jan', progress: 0 },
    ]

    const recentCourses: any[] = [] // Empty real courses

    // If we want to show Workshops as courses:
    // const registrations = await prisma.workshopRegistration.findMany({ ... })
    // We need the userId for that.

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

