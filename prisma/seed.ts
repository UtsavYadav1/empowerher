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
  // await prisma.product.deleteMany() // Don't wipe products to preserve manual entries

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
  // console.log('Seeding products (Upserting)...')
  // const seller = await prisma.user.findFirst()
  // const sellerId = seller?.id || 1

  // const richProducts = [
  //   {
  //     title: 'Lemon Ginger Pickle',
  //     description: 'Fresh lemons blended with ginger and hand-ground spices. This pickle aids digestion and adds a tangy, spicy flavor to your meals.',
  //     category: 'pickles',
  //     price: 140,
  //     stock: 50,
  //     village: 'Adampur',
  //     image: 'https://images.unsplash.com/photo-1589621316382-008455b857cd?w=400&h=400&fit=crop&q=80'
  //   },
  //   {
  //     title: 'Handmade Jute Basket',
  //     description: 'Natural jute storage basket handcrafted by women artisans. Ideal for home organization and decor.',
  //     category: 'crafts',
  //     price: 450,
  //     stock: 20,
  //     village: 'Ranipur',
  //     image: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400&h=400&fit=crop&q=80'
  //   },
  //   {
  //     title: 'Spicy Mango Pickle',
  //     description: 'Homemade traditional mango pickle prepared using sun-dried raw mangoes, cold-pressed mustard oil, and authentic spices.',
  //     category: 'pickles',
  //     price: 150,
  //     stock: 100,
  //     village: 'Sultanganj',
  //     image: 'https://images.unsplash.com/photo-1599909533650-d0dbde68a7b4?w=400&h=400&fit=crop&q=80'
  //   },
  //   {
  //     title: 'Embroidered Tote Bag',
  //     description: 'Eco-friendly cotton tote bag with intricate hand embroidery. Durable, stylish, and perfect for daily use.',
  //     category: 'textiles',
  //     price: 350,
  //     stock: 30,
  //     village: 'Bilaspur',
  //     image: 'https://images.unsplash.com/photo-1590891626587-94e43cc2c6ba?w=400&h=400&fit=crop&q=80'
  //   },
  //   {
  //     title: 'Terracotta Diya Set',
  //     description: 'Set of 6 beautifully painted terracotta diyas for festivals and home decoration. Eco-friendly and handmade.',
  //     category: 'diya',
  //     price: 200,
  //     stock: 200,
  //     village: 'Kishanpur',
  //     image: 'https://images.unsplash.com/photo-1605815797511-d87b62d4c7eb?w=400&h=400&fit=crop&q=80'
  //   },
  //   {
  //     title: 'Homemade Red Chilli Powder',
  //     description: 'Sun-dried red chillies ground hygienically at home. Adds rich color and authentic spice to your dishes.',
  //     category: 'food',
  //     price: 130,
  //     stock: 80,
  //     village: 'Adampur',
  //     image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop&q=80'
  //   }
  // ]

  // for (const product of richProducts) {
  //   // Upsert products to avoid duplication but update fields
  //   const existing = await prisma.product.findFirst({ where: { title: product.title } })
  //   if (existing) {
  //     await prisma.product.update({
  //       where: { id: existing.id },
  //       data: {
  //         description: product.description,
  //         category: product.category,
  //         images: [product.image],
  //         price: product.price,
  //         stock: product.stock,
  //         village: product.village,
  //       }
  //     })
  //   } else {
  //     await prisma.product.create({
  //       data: {
  //         title: product.title,
  //         description: product.description,
  //         category: product.category,
  //         images: [product.image],
  //         price: product.price,
  //         stock: product.stock,
  //         sellerId: sellerId,
  //         village: product.village,
  //       },
  //     })
  //   }
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

  // Additional Real Government Schemes
  console.log('Seeding extra government schemes...')
  const extraSchemes = [
    {
      title: 'Pradhan Mantri Matru Vandana Yojana',
      description: 'Maternity benefit program providing financial assistance to pregnant and lactating women.',
      eligibility: 'Pregnant women and lactating mothers',
      applyUrl: 'https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana',
      deadline: null
    },
    {
      title: 'Mahila Samman Savings Certificate',
      description: 'Small savings scheme for women and girls with 7.5% interest rate.',
      eligibility: 'Any woman or girl child',
      applyUrl: 'https://www.indiapost.gov.in/',
      deadline: new Date('2025-03-31')
    },
    {
      title: 'Udyogini Scheme',
      description: 'Subsidized loans for women entrepreneurs in agriculture, retail, and small business sectors.',
      eligibility: 'Women aged 18-55, family income < 1.5 Lakh',
      applyUrl: 'https://meity.gov.in/',
      deadline: null
    },
    {
      title: 'Vigyan Jyoti Scheme',
      description: 'Encouraging girls to pursue higher education and careers in STEM fields.',
      eligibility: 'Meritorious girls in Class 9-12',
      applyUrl: 'https://dst.gov.in/',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    }
  ]

  for (const schemeData of extraSchemes) {
    await prisma.scheme.create({
      data: {
        title: schemeData.title,
        description: schemeData.description,
        eligibility: schemeData.eligibility,
        applyUrl: schemeData.applyUrl,
        deadline: schemeData.deadline,
      },
    })
  }

  // Seed Workshops
  console.log('Seeding Workshops...')
  const workshopData = [
    {
      title: 'Digital Literacy for Girls',
      village: 'Adampur',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
      description: 'Learn how to use computers, smartphones, and the internet safely.',
      instructor: 'Dr. Anita Sharma',
      category: 'Technology',
      capacity: 30,
      fee: 0,
      status: 'upcoming'
    },
    {
      title: 'Women Entrepreneurship Bootcamp',
      village: 'Ranipur',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 days
      description: 'Start your own business with guidance from successful mentors.',
      instructor: 'Ms. Priya Singh',
      category: 'Business',
      capacity: 50,
      fee: 500,
      status: 'upcoming'
    },
    {
      title: 'Menstrual Health & Hygiene Awareness',
      village: 'Sultanganj',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
      description: 'Expert-led session on health, hygiene, and breaking taboos.',
      instructor: 'Dr. Ritu Verma',
      category: 'Health',
      capacity: 100,
      fee: 0,
      status: 'upcoming'
    },
    {
      title: 'Financial Literacy for Homemakers',
      village: 'Bilaspur',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // +21 days
      description: 'Learn budgeting, saving, and basics of banking and investment.',
      instructor: 'Mr. Rajesh Kumar',
      category: 'Finance',
      capacity: 40,
      fee: 100,
      status: 'upcoming'
    },
    {
      title: 'Self-Defense Training Camp',
      village: 'Adampur',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // +10 days
      description: 'Practical self-defense techniques for safety and confidence.',
      instructor: 'Coach Suman',
      category: 'Skill Development',
      capacity: 25,
      fee: 200,
      status: 'upcoming'
    },
    {
      title: 'Organic Farming Techniques',
      village: 'Kishanpur',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      description: 'Modern organic farming methods to increase crop yield and income.',
      instructor: 'Agri-Expert Ramesh',
      category: 'Agriculture',
      capacity: 60,
      fee: 150,
      status: 'upcoming'
    }
  ]
  for (const workshop of workshopData) {
    await prisma.workshop.create({
      data: {
        title: workshop.title,
        village: workshop.village,
        date: workshop.date,
        description: workshop.description,
        instructor: workshop.instructor,
        category: workshop.category,
        capacity: workshop.capacity,
        fee: workshop.fee,
        status: workshop.status
      },
    })
  }

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
  console.log('Seeding events...')
  const events = [
    {
      title: 'Global Scholarship Test 2026',
      description: 'Annual scholarship test for merit students. 100% tuition waiver.',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
      type: 'scholarship',
      category: 'education',
      eligibility: 'Class 10th and 12th students',
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      applyUrl: '#',
      benefits: ['Full Tuition Fee', 'Laptop', 'Mentorship']
    },
    {
      title: 'Tech Skills Workshop',
      description: 'Hands-on workshop on web development and design.',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // +10 days
      type: 'workshop',
      category: 'skills',
      location: 'Online via Zoom',
      organizer: 'TechForGood',
      benefits: ['Certificate', 'Project Experience']
    },
    {
      title: 'Career Counseling Session',
      description: 'One-on-one career counseling session with industry experts.',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // +15 days
      type: 'session',
      category: 'career',
      location: 'Community Hall, Sector 4',
      organizer: 'EmpowerHer Team'
    },
    {
      title: 'National Girl Child Day Celebration',
      description: 'Competitions, performances, and awards to celebrate the potential of girls.',
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      type: 'competition',
      category: 'culture',
      location: 'City Auditorium',
      organizer: 'District Administration',
      registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      applyUrl: '#',
      benefits: ['Cash Prizes', 'Trophies', 'Certificates']
    },
    {
      title: 'Women in STEM Webinar',
      description: 'Inspirational talk by leading women scientists and engineers.',
      date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      type: 'webinar',
      category: 'education',
      location: 'Online via Google Meet',
      organizer: 'Science for All Foundation',
      applyUrl: 'https://meet.google.com/',
      benefits: ['Knowledge', 'Networking']
    },
    {
      title: 'Art & Craft Exhibition',
      description: 'Showcase your artistic talents and sell your handmade products.',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      type: 'session',
      category: 'arts',
      location: 'Village Square',
      organizer: 'Local Artisans Guild',
      benefits: ['Sales Opportunity', 'Exposure']
    }
  ]
  for (const event of events) {
    await prisma.event.create({ data: event })
  }

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

