import { NextRequest } from 'next/server'

// Mock Prisma methods used in route
const mockFindMany = jest.fn()
const mockCreate = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    product: {
      findMany: mockFindMany,
      create: mockCreate,
      update: mockUpdate,
    },
  })),
}))

import { GET, POST, PATCH } from '@/app/api/mock/products/route'

function makeRequest(method: string, body?: any, query?: string): NextRequest {
  const url = `http://localhost/api/mock/products${query ? `?${query}` : ''}`
  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  } as any)
}

describe('Products Mock API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('lists products', async () => {
    mockFindMany.mockResolvedValueOnce([{ id: 1, title: 'A' }])
    const req = makeRequest('GET')
    const res = await GET(req)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)
  })

  it('creates a product', async () => {
    mockCreate.mockResolvedValueOnce({ id: 2, title: 'Test Pickle' })
    const req = makeRequest('POST', {
      title: 'Test Pickle',
      description: 'Tasty',
      category: 'pickles',
      images: ['/images/hero.jpg'],
      price: 99,
      stock: 10,
      sellerId: 1,
      village: 'Rampur',
    })
    const res = await POST(req)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.title).toBe('Test Pickle')
  })

  it('updates a product', async () => {
    mockUpdate.mockResolvedValueOnce({ id: 3, price: 123 })
    const req = makeRequest('PATCH', { id: 3, price: 123 })
    const res = await PATCH(req)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.price).toBe(123)
  })
})
