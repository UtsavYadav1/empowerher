import { NextRequest, NextResponse } from 'next/server'

// Mock tutorials data with specific YouTube video IDs for women entrepreneurs
let tutorials = [
  // Business Category
  {
    id: 1,
    title: 'How to Start a Small Business - Complete Guide',
    description: 'Learn the complete process of starting your own small business from scratch, covering business planning, registration, and initial setup.',
    youtubeId: 'Ibb5KE3GcVI', // Ted Talk - How to Start a Small Business
    duration: '18:25',
    category: 'business',
    watched: false,
  },
  {
    id: 2,
    title: 'Building a Successful Business Plan',
    description: 'Step-by-step guide to creating a comprehensive business plan that attracts investors and guides your business growth.',
    youtubeId: 'WD_JpnYrHWs', // Business Plan Tutorial
    duration: '15:42',
    category: 'business',
    watched: false,
  },
  {
    id: 3,
    title: 'Time Management for Entrepreneurs',
    description: 'Master time management techniques to balance business operations, family life, and personal growth effectively.',
    youtubeId: 'iONDebHX9qk', // Time Management
    duration: '14:30',
    category: 'business',
    watched: false,
  },
  {
    id: 4,
    title: 'Product Photography on a Budget',
    description: 'Learn to take stunning product photos using just your smartphone and simple lighting techniques.',
    youtubeId: 'z-cBP9Xnl98', // Product Photography Tutorial
    duration: '12:18',
    category: 'business',
    watched: false,
  },
  {
    id: 5,
    title: 'Pricing Strategies for Maximum Profit',
    description: 'Understand different pricing strategies and how to price your products to maximize profit while staying competitive.',
    youtubeId: 'M2Lw580dh5A', // Pricing Strategy
    duration: '16:05',
    category: 'business',
    watched: false,
  },
  
  // Marketing Category
  {
    id: 6,
    title: 'Social Media Marketing Basics',
    description: 'Complete guide to marketing your business on social media platforms like Facebook, Instagram, and WhatsApp.',
    youtubeId: 'qGpI1X5xJxo', // Social Media Marketing Basics
    duration: '22:15',
    category: 'marketing',
    watched: false,
  },
  {
    id: 7,
    title: 'Instagram Marketing for Small Business',
    description: 'Learn how to grow your business on Instagram with effective content strategies, reels, and stories.',
    youtubeId: 'n7JH0ZP7mxI', // Instagram Marketing
    duration: '19:40',
    category: 'marketing',
    watched: false,
  },
  {
    id: 8,
    title: 'Facebook Marketing Complete Course',
    description: 'Master Facebook marketing including creating business pages, running ads, and engaging with customers.',
    youtubeId: 'B8yMPTlsj4s', // Facebook Marketing
    duration: '25:30',
    category: 'marketing',
    watched: false,
  },
  {
    id: 9,
    title: 'WhatsApp Business for Entrepreneurs',
    description: 'Learn how to use WhatsApp Business to connect with customers, showcase products, and manage orders.',
    youtubeId: 'mxV0qMRcCPE', // WhatsApp Business Tutorial
    duration: '13:50',
    category: 'marketing',
    watched: false,
  },
  {
    id: 10,
    title: 'Content Marketing Strategies',
    description: 'Create engaging content that attracts customers and builds your brand presence online.',
    youtubeId: 'zYR4uhxExBc', // Content Marketing
    duration: '17:22',
    category: 'marketing',
    watched: false,
  },
  
  // Finance Category
  {
    id: 11,
    title: 'Basic Accounting for Small Business',
    description: 'Learn fundamental accounting principles every business owner should know to manage finances effectively.',
    youtubeId: 'aw2okpWUu30', // Basic Accounting
    duration: '20:35',
    category: 'finance',
    watched: false,
  },
  {
    id: 12,
    title: 'Managing Business Cash Flow',
    description: 'Understand how to manage cash flow, track expenses, and ensure your business stays financially healthy.',
    youtubeId: 'Ef8a8vjhGCo', // Cash Flow Management
    duration: '15:28',
    category: 'finance',
    watched: false,
  },
  {
    id: 13,
    title: 'Financial Planning for Entrepreneurs',
    description: 'Comprehensive guide to financial planning including budgeting, saving, and investing for business growth.',
    youtubeId: 'z9NvFyGvbBE', // Financial Planning
    duration: '18:45',
    category: 'finance',
    watched: false,
  },
  {
    id: 14,
    title: 'Understanding Profit and Loss',
    description: 'Learn how to read and create profit & loss statements to track your business performance.',
    youtubeId: 'wCPDuMGb-Bs', // P&L Statement
    duration: '14:10',
    category: 'finance',
    watched: false,
  },
  {
    id: 15,
    title: 'Tax Basics for Small Business Owners',
    description: 'Essential information about taxes, GST, and compliance for small business owners in India.',
    youtubeId: 'q-b2oqRZHso', // Tax Basics
    duration: '21:15',
    category: 'finance',
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
