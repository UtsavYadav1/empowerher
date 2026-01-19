/*
 Automated verification script for EmpowerHer
 Requires local server running on http://localhost:3000
 Run with: npx tsx scripts/verify.ts
*/

const VERIFY_BASE = process.env.BASE_URL || 'http://localhost:3000'

type Check = {
  name: string
  run: () => Promise<boolean>
  note?: string
}

function log(msg: string) {
  process.stdout.write(msg + '\n')
}

async function safeFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${VERIFY_BASE}${path}`, init)
  let json: any = null
  try { json = await res.json() } catch { /* xml or text */ }
  return { ok: res.ok, status: res.status, json }
}

function randomPhone() {
  return '+91' + Math.floor(7000000000 + Math.random() * 1000000000).toString()
}

async function main() {
  const phone = randomPhone()
  let userId: number | null = null

  const checks: Check[] = [
    {
      name: 'Register',
      run: async () => {
        const { ok, json } = await safeFetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Verify User', phone, password: 'pass123', village: 'Rampur' }),
        })
        if (ok) userId = json?.data?.id ?? null
        return ok && Boolean(userId)
      },
    },
    {
      name: 'Login',
      run: async () => {
        const { ok, json } = await safeFetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password: 'pass123' }),
        })
        return ok && Boolean(json?.data?.token)
      },
    },
    {
      name: 'Role select (PATCH /api/users/:id)',
      run: async () => {
        if (!userId) return false
        const { ok, json } = await safeFetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'woman', verified: true }),
        })
        return ok && json?.data?.role === 'woman'
      },
    },
    {
      name: 'Girl – Schemes GET',
      run: async () => {
        const { ok, json } = await safeFetch('/api/mock/schemes')
        return ok && Array.isArray(json?.data)
      },
    },
    {
      name: 'Girl – Forum POST',
      run: async () => {
        const { ok } = await safeFetch('/api/mock/forum', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author: 'Verify Bot', content: 'Hello from verify!' }),
        })
        return ok
      },
    },
    {
      name: 'Woman – Add product',
      run: async () => {
        const { ok } = await safeFetch('/api/mock/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Verify Product',
            description: 'Automated test item',
            category: 'crafts',
            images: ['/images/hero.jpg'],
            price: 123,
            stock: 5,
            sellerId: userId || 1,
            village: 'Rampur',
          }),
        })
        return ok
      },
    },
    {
      name: 'Woman – Finance GET',
      run: async () => {
        const { ok, json } = await safeFetch('/api/mock/finance')
        return ok && Array.isArray(json?.data)
      },
    },
    {
      name: 'Woman – Tutorials GET',
      run: async () => {
        const { ok, json } = await safeFetch('/api/mock/tutorials')
        return ok && Array.isArray(json?.data)
      },
    },
    {
      name: 'Customer – Payments (simulate UPI)',
      run: async () => {
        const { ok, json } = await safeFetch('/api/mock/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 199, method: 'upi', orderId: 'ORD_VERIFY', upiId: 'test@upi' }),
        })
        // Accept either success or failure response (endpoint is 50/50)
        return Boolean(json && typeof json.success === 'boolean')
      },
    },
    {
      name: 'Admin – Add scheme',
      run: async () => {
        const { ok } = await safeFetch('/api/mock/finance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Verify Scheme',
            description: 'Automated test scheme',
            eligibility: 'All',
            applyUrl: 'https://example.com'
          }),
        })
        return ok
      },
    },
    {
      name: 'IVR – XML response',
      run: async () => {
        const res = await fetch(`${VERIFY_BASE}/api/mock/ivr`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
        const txt = await res.text()
        return res.ok && txt.includes('<Response>')
      },
    },
  ]

  let pass = 0
  let fail = 0
  const details: string[] = []

  for (const c of checks) {
    try {
      const ok = await c.run()
      if (ok) {
        pass++
        details.push(`PASS - ${c.name}`)
      } else {
        fail++
        details.push(`FAIL - ${c.name}`)
      }
    } catch (e: any) {
      fail++
      details.push(`FAIL - ${c.name} :: ${e?.message || e}`)
    }
  }

  log('--- Verification Report ---')
  details.forEach(d => log(d))
  log(`\nSummary: ${pass} passed, ${fail} failed`)

  // Exit code for CI
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

export { }