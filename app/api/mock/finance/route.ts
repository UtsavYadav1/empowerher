import { NextRequest, NextResponse } from 'next/server'

// Mock finance/loan schemes data
const financeSchemes = [
  {
    id: 1,
    title: 'MUDRA Loan Scheme',
    description: 'Micro Units Development & Refinance Agency (MUDRA) loans for women entrepreneurs',
    amount: 'Up to ₹10 Lakh',
    interestRate: '8-12%',
    eligibility: 'Women entrepreneurs, age 18+, business plan required',
    applyUrl: 'https://www.mudra.org.in/',
    deadline: null,
    category: 'business',
  },
  {
    id: 2,
    title: 'Stand Up India Scheme',
    description: 'Bank loans for SC/ST and women entrepreneurs',
    amount: '₹10 Lakh to ₹1 Crore',
    interestRate: '10-12%',
    eligibility: 'Women/SC/ST entrepreneurs, age 18+, greenfield project',
    applyUrl: 'https://www.standupmitra.in/',
    deadline: null,
    category: 'business',
  },
  {
    id: 3,
    title: 'Annapurna Scheme',
    description: 'Food catering business loan for women',
    amount: 'Up to ₹50,000',
    interestRate: '4%',
    eligibility: 'Women above 18 years, no collateral required',
    applyUrl: 'https://www.annapurna.gov.in/',
    deadline: null,
    category: 'business',
  },
  {
    id: 4,
    title: 'Mahila Udyam Nidhi Scheme',
    description: 'Financial assistance for women entrepreneurs',
    amount: 'Up to ₹10 Lakh',
    interestRate: '9-10%',
    eligibility: 'Women entrepreneurs, business registration required',
    applyUrl: 'https://www.sidbi.in/',
    deadline: null,
    category: 'business',
  },
]

// GET - List all finance schemes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    let filteredSchemes = financeSchemes
    if (category) {
      filteredSchemes = filteredSchemes.filter(s => s.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredSchemes,
      count: filteredSchemes.length,
    })
  } catch (error) {
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

    const newScheme = {
      id: financeSchemes.length + 1,
      title,
      description,
      eligibility,
      applyUrl,
      amount: amount || 'As per bank policy',
      interestRate: interestRate || 'Varies',
      category,
      deadline,
    }
    financeSchemes.push(newScheme)

    return NextResponse.json({ success: true, data: newScheme }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create finance scheme' },
      { status: 500 }
    )
  }
}

