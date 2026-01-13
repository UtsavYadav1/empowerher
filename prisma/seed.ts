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
  // Clear existing data (reverse order of dependencies)
  console.log('Clearing existing data...')
  await prisma.forumReply.deleteMany()
  await prisma.forumPost.deleteMany()
  await prisma.tutorial.deleteMany()
  await prisma.event.deleteMany()
  await prisma.financeScheme.deleteMany()
  await prisma.order.deleteMany()
  await prisma.workshop.deleteMany()
  await prisma.scheme.deleteMany()
  await prisma.product.deleteMany()
  // await prisma.user.deleteMany() // Preserving users if needed, or clear distinctively

  // Seed Users
  console.log('Seeding users...')
  for (const userData of seedData.users) {
    await prisma.user.upsert({
      where: { phone: userData.phone },
      update: {},
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

  // Seed Products
  console.log('Skipping products seed (Clean Start)...')
  // for (const productData of seedData.products) {
  //   await prisma.product.create({
  //     data: {
  //       title: productData.title,
  //       description: productData.description,
  //       category: productData.category,
  //       images: typeof productData.images === 'string' ? JSON.parse(productData.images) : productData.images,
  //       price: productData.price,
  //       stock: productData.stock,
  //       sellerId: productData.sellerId,
  //       village: productData.village,
  //     },
  //   })
  // }

  // Seed Schemes
  console.log('Seeding government schemes...')
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

  // Seed Workshops
  console.log('Skipping workshops seed (Clean Start)...')
  // for (const workshopData of seedData.workshops) {
  //   await prisma.workshop.create({
  //     data: {
  //       title: workshopData.title,
  //       village: workshopData.village,
  //       date: new Date(workshopData.date),
  //       description: workshopData.description,
  //     },
  //   })
  // }

  // Seed Orders
  console.log('Skipping orders seed (Clean Start)...')
  // for (const orderData of seedData.orders) {
  //   await prisma.order.create({
  //     data: {
  //       customerId: orderData.customerId,
  //       items: typeof orderData.items === 'string' ? JSON.parse(orderData.items) : orderData.items,
  //       total: orderData.total,
  //       status: orderData.status,
  //     },
  //   })
  // }

  // --- NEW FEATURES ---

  // Seed Finance Schemes
  console.log('Seeding finance schemes...')
  const financeSchemes = [
    {
      title: 'MUDRA Loan Scheme',
      description: 'Micro Units Development & Refinance Agency (MUDRA) loans for women entrepreneurs',
      amount: 'Up to ₹10 Lakh',
      interestRate: '8-12%',
      eligibility: 'Women entrepreneurs, age 18+, business plan required',
      applyUrl: 'https://www.mudra.org.in/',
      category: 'business',
    },
    {
      title: 'Stand Up India Scheme',
      description: 'Bank loans for SC/ST and women entrepreneurs',
      amount: '₹10 Lakh to ₹1 Crore',
      interestRate: '10-12%',
      eligibility: 'Women/SC/ST entrepreneurs, age 18+, greenfield project',
      applyUrl: 'https://www.standupmitra.in/',
      category: 'business',
    },
    {
      title: 'Annapurna Scheme',
      description: 'Food catering business loan for women',
      amount: 'Up to ₹50,000',
      interestRate: '4%',
      eligibility: 'Women above 18 years, no collateral required',
      applyUrl: 'https://www.annapurna.gov.in/',
      category: 'business',
    },
    {
      title: 'Mahila Udyam Nidhi Scheme',
      description: 'Financial assistance for women entrepreneurs',
      amount: 'Up to ₹10 Lakh',
      interestRate: '9-10%',
      eligibility: 'Women entrepreneurs, business registration required',
      applyUrl: 'https://www.sidbi.in/',
      category: 'business',
    }
  ]
  for (const scheme of financeSchemes) {
    await prisma.financeScheme.create({ data: scheme })
  }

  // Seed Events
  console.log('Skipping events seed (Clean Start)...')
  // const events = [
  //   {
  //     title: 'Scholarship Application Deadline',
  //     description: 'Beti Bachao Beti Padhao Scholarship deadline approaching',
  //     date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
  //     type: 'scholarship',
  //     category: 'education',
  //   },
  //   {
  //     title: 'Digital Literacy Workshop',
  //     description: 'Learn basic computer skills and internet usage',
  //     date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // +10 days
  //     type: 'workshop',
  //     category: 'skills',
  //   },
  //   {
  //     title: 'Career Guidance Session',
  //     description: 'One-on-one career counseling session',
  //     date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // +15 days
  //     type: 'session',
  //     category: 'career',
  //   }
  // ]
  // for (const event of events) {
  //   await prisma.event.create({ data: event })
  // }

  // Seed Tutorials
  console.log('Seeding tutorials...')
  const tutorials = [
    {
      title: 'How to Start a Small Business - Complete Guide',
      description: 'Learn the complete process of starting your own small business from scratch.',
      youtubeId: 'Ibb5KE3GcVI',
      duration: '18:25',
      category: 'business',
    },
    {
      title: 'Social Media Marketing Basics',
      description: 'Complete guide to marketing your business on social media.',
      youtubeId: 'qGpI1X5xJxo',
      duration: '22:15',
      category: 'marketing',
    },
    {
      title: 'Basic Accounting for Small Business',
      description: 'Learn fundamental accounting principles.',
      youtubeId: 'aw2okpWUu30',
      duration: '20:35',
      category: 'finance',
    }
  ]
  for (const tutorial of tutorials) {
    await prisma.tutorial.create({ data: tutorial })
  }

  // Seed Forum
  console.log('Seeding forum posts...')
  const forumPosts = [
    {
      title: 'How to prepare for scholarship exams?',
      author: 'Priya S.',
      content: 'I am preparing for scholarship exams and need some guidance on topics and best books.',
      replies: [
        { author: 'Anjali P.', content: 'Focus on practicing previous year papers and daily revision.' },
      ]
    },
    {
      title: 'Best courses for career guidance',
      author: 'Kavita S.',
      content: 'Can anyone suggest good online courses for career guidance in tech?',
      replies: []
    }
  ]
  // Seed Forum
  console.log('Skipping forum seed (Clean Start)...')
  // for (const post of forumPosts) {
  //   await prisma.forumPost.create({
  //     data: {
  //       title: post.title,
  //       author: post.author,
  //       content: post.content,
  //       replies: {
  //         create: post.replies.map(reply => ({
  //           author: reply.author,
  //           content: reply.content
  //         }))
  //       }
  //     }
  //   })
  // }

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

