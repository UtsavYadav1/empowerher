import { NextRequest } from 'next/server'

const mockFindUnique = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    order: {
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
  })),
}))

import { GET, PUT } from '@/app/api/mock/orders/[id]/route'

function makeRequest(method: string, body?: any, id: number = 1): NextRequest {
  const url = `http://localhost/api/mock/orders/${id}`
  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  } as any)
}

describe('Orders Mock API', () => {
  beforeEach(() => jest.clearAllMocks())

  it('gets an order by id', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 1, items: '[]', total: 100, status: 'pending', createdAt: new Date().toISOString() })
    const req = makeRequest('GET', undefined, 1)
    const res = await GET(req as any, { params: { id: '1' } })
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe(1)
  })

  it('updates order feedback', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 2, items: JSON.stringify([{ productId: 1, quantity: 1 }]), total: 100, status: 'delivered', createdAt: new Date().toISOString() })
    mockUpdate.mockResolvedValueOnce({ id: 2, items: JSON.stringify([{ productId: 1, quantity: 1, rating: 5 }]), total: 100, status: 'delivered', createdAt: new Date().toISOString() })

    const req = makeRequest('PUT', { rating: 5 }, 2)
    const res = await PUT(req as any, { params: { id: '2' } })
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.id).toBe(2)
  })
})
