// In-memory session store (in production, use Redis or database)
export const sessions = new Map<string, { userId: number; expiresAt: number }>()

export function validateToken(token: string): { userId: number } | null {
  const session = sessions.get(token)
  if (!session) return null

  if (Date.now() > session.expiresAt) {
    sessions.delete(token)
    return null
  }

  return { userId: session.userId }
}

export function createSession(userId: number, token: string): void {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  sessions.set(token, { userId, expiresAt })
}

export function deleteSession(token: string): void {
  sessions.delete(token)
}

