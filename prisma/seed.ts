import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface SeedData {
  users: Array<{
    name: string
    phone: string
    password: string
    role?: string
    village?: string
    verified?: boolean
  }>
  products: Array<{
    title: string
    description: string
    category: string
    images: string
    price: number
    stock: number
    sellerId: number
    village: string
  }>
  schemes: Array<{
    title: string
    description: string
    eligibility: string
    applyUrl: string
    deadline?: string | null
  }>
  workshops: Array<{
    title: string
    village: string
    date: string
    description: string
  }>
  orders: Array<{
    customerId: number
    items: string
    total: number
    status: string
  }>
}

async function main() {
  console.log('Starting seed...')

  // Read seed data
  const seedDataPath = path.join(process.cwd(), 'data', 'seed.json')
  const seedData: SeedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'))

  // Clear existing data
  // Clear existing data
  console.log('Clearing existing data (except Users)...')
  await prisma.order.deleteMany()
  await prisma.workshop.deleteMany()
  await prisma.scheme.deleteMany()
  await prisma.product.deleteMany()
  // await prisma.user.deleteMany() // Preserving users

  // Seed Users
  console.log('Seeding users...')
  for (const userData of seedData.users) {
    await prisma.user.upsert({
      where: { phone: userData.phone },
      update: {}, // Don't overwrite existing user data
      create: {
        name: userData.name,
        phone: userData.phone,
        password: userData.password,
        role: userData.role || null,
        village: userData.village || null,
        verified: userData.verified ?? false,
      },
    })
  }
  console.log(`✓ Created ${seedData.users.length} users`)

  // Seed Products
  console.log('Seeding products...')
  for (const productData of seedData.products) {
    await prisma.product.create({
      data: {
        title: productData.title,
        description: productData.description,
        category: productData.category,
        images: typeof productData.images === 'string' ? JSON.parse(productData.images) : productData.images,
        price: productData.price,
        stock: productData.stock,
        sellerId: productData.sellerId,
        village: productData.village,
      },
    })
  }
  console.log(`✓ Created ${seedData.products.length} products`)

  // Seed Schemes
  console.log('Seeding schemes...')
  for (const schemeData of seedData.schemes) {
    await prisma.scheme.create({
      data: {
        title: schemeData.title,
        description: schemeData.description,
        eligibility: schemeData.eligibility,
        applyUrl: schemeData.applyUrl,
        deadline: schemeData.deadline ? new Date(schemeData.deadline) : null,
      },
    })
  }
  console.log(`✓ Created ${seedData.schemes.length} schemes`)

  // Seed Workshops
  console.log('Seeding workshops...')
  for (const workshopData of seedData.workshops) {
    await prisma.workshop.create({
      data: {
        title: workshopData.title,
        village: workshopData.village,
        date: new Date(workshopData.date),
        description: workshopData.description,
      },
    })
  }
  console.log(`✓ Created ${seedData.workshops.length} workshops`)

  // Seed Orders
  console.log('Seeding orders...')
  for (const orderData of seedData.orders) {
    await prisma.order.create({
      data: {
        customerId: orderData.customerId,
        items: typeof orderData.items === 'string' ? JSON.parse(orderData.items) : orderData.items,
        total: orderData.total,
        status: orderData.status,
      },
    })
  }
  console.log(`✓ Created ${seedData.orders.length} orders`)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

