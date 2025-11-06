import { NextRequest } from 'next/server'

// Mock PrismaClient used inside route handlers
const mockFindFirst = jest.fn()
const mockCreate = jest.fn()
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findFirst: mockFindFirst,
        create: mockCreate,
      },
    })),
  }
})

// Import after mocks
import { POST as registerPOST } from '@/app/api/auth/register/route'
import { POST as loginPOST } from '@/app/api/auth/login/route'

function makeRequest(body: any): NextRequest {
  return new NextRequest('http://localhost/api', {
    method: 'POST',
    body: JSON.stringify(body),
  } as any)
}

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('registers a new user', async () => {
    mockFindFirst.mockResolvedValueOnce(null)
    mockCreate.mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
      phone: '+910000000000',
      password: 'pass',
      role: null,
      village: 'Rampur',
      verified: false,
      createdAt: new Date(),
    })

    const req = makeRequest({ name: 'Test User', phone: '+910000000000', password: 'pass', village: 'Rampur' })
    const res = await registerPOST(req)
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Test User')
  })

  it('logs in an existing user', async () => {
    mockFindFirst.mockResolvedValueOnce({
      id: 2,
      name: 'Login User',
      phone: '+919999999999',
      password: 'secret',
      role: 'customer',
      village: 'Rampur',
      verified: true,
    })

    const req = makeRequest({ phone: '+919999999999', password: 'secret' })
    const res = await loginPOST(req)
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.user.phone).toBe('+919999999999')
    expect(typeof json.data.token).toBe('string')
  })
})
