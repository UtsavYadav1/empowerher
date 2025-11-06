import { NextRequest, NextResponse } from 'next/server'

// Mock tutorials data with specific YouTube video IDs for women entrepreneurs
let tutorials = [
  {
    id: 1,
    title: 'How to Start Your Online Business from Home',
    description: 'Learn the basics of starting an online business from scratch, including product selection, setting up your store, and marketing strategies.',
    youtubeId: 'jNQXAC9IVRw', // How to Start a Business - Real example
    duration: '15:30',
    category: 'business',
    watched: false,
  },
  {
    id: 2,
    title: 'Digital Marketing for Small Businesses',
    description: 'Introduction to digital marketing strategies including social media marketing, email campaigns, and SEO basics for small businesses.',
    youtubeId: 'bixR-KIJKYM', // Digital Marketing Tutorial
    duration: '20:45',
    category: 'marketing',
    watched: false,
  },
  {
    id: 3,
    title: 'Financial Planning for Women Entrepreneurs',
    description: 'Essential financial planning tips including budgeting, saving, managing cash flow, and understanding basic accounting for women entrepreneurs.',
    youtubeId: 'K8eZOwCoPQM', // Financial Planning Basics
    duration: '18:20',
    category: 'finance',
    watched: false,
  },
  {
    id: 4,
    title: 'Handmade Product Photography Tips',
    description: 'Learn how to take professional photos of your handmade products using your smartphone to boost online sales.',
    youtubeId: '7DXs8lhYj8c', // Product Photography
    duration: '12:15',
    category: 'business',
    watched: false,
  },
  {
    id: 5,
    title: 'Pricing Your Products for Profit',
    description: 'Understand how to calculate the right price for your products to ensure profitability while remaining competitive.',
    youtubeId: 'xKm0jRZQfvY', // Pricing Strategy
    duration: '14:30',
    category: 'business',
    watched: false,
  },
  {
    id: 6,
    title: 'Social Media Marketing for Women Entrepreneurs',
    description: 'Master Facebook, Instagram, and WhatsApp marketing to reach more customers and grow your business.',
    youtubeId: 'Z0lxJswVeKc', // Social Media Marketing
    duration: '22:10',
    category: 'marketing',
    watched: false,
  },
  {
    id: 7,
    title: 'Managing Inventory and Stock',
    description: 'Learn how to track inventory, manage stock levels, and avoid overstocking or stockouts.',
    youtubeId: '1FJ94sH2m0g', // Inventory Management
    duration: '16:45',
    category: 'business',
    watched: false,
  },
  {
    id: 8,
    title: 'Customer Service Excellence',
    description: 'Build customer loyalty through excellent service, handling complaints, and creating positive customer experiences.',
    youtubeId: 'r3nYk5KvM8U', // Customer Service
    duration: '13:20',
    category: 'business',
    watched: false,
  },
]

// GET - List all tutorials
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    let filteredTutorials = tutorials
    if (category && category !== 'all') {
      filteredTutorials = tutorials.filter(t => t.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredTutorials,
      count: filteredTutorials.length,
    })
  } catch (error) {
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

    const tutorial = tutorials.find(t => t.id === parseInt(tutorialId))
    if (!tutorial) {
      return NextResponse.json(
        { success: false, error: 'Tutorial not found' },
        { status: 404 }
      )
    }

    tutorial.watched = watched

    return NextResponse.json({
      success: true,
      data: tutorial,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update tutorial' },
      { status: 500 }
    )
  }
}
