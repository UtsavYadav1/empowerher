import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting video interaction fix...')

    const tutorials = [
        {
            title: 'Business Planning 101 for Small Business (Hindi)',
            description: 'Learn how to plan your business effectively in Hindi. Covers basics of entrepreneurship.',
            category: 'Business',
            youtubeId: 'sI3x_4S74sU',
            duration: '15 min',
        },
        {
            title: 'Shop Business Plan Strategy (Hindi)',
            description: 'Complete guide to starting and managing a shop business in India.',
            category: 'Business',
            youtubeId: 'F_fKq25n67w',
            duration: '20 min',
        },
        {
            title: 'Basic Computer Course for Beginners (Hindi)',
            description: 'A complete guide to understanding computer basics, from hardware to software.',
            category: 'Technology',
            youtubeId: '9_iM8d04U8w',
            duration: '45 min',
        },
        {
            title: 'Learn Office Automation (Hindi)',
            description: 'Master essential office tools like Word and Excel in Hindi.',
            category: 'Technology',
            youtubeId: '0h62pT_3_3M',
            duration: '50 min',
        },
        {
            title: 'Tailoring Guide: Salwar Cutting (Hindi)',
            description: 'Step-by-step tutorial on cutting and stitching a Salwar suit.',
            category: 'Arts',
            youtubeId: 'vKjQ6hdEGSc',
            duration: '25 min',
        },
        {
            title: 'Beauty Parlor Course: Facial Theory (Hindi)',
            description: 'Professional beauty parlor course covering facial techniques and theory.',
            category: 'Arts',
            youtubeId: 'v_R2XbB9898',
            duration: '30 min',
        },
        {
            title: 'Secrets of Great Public Speaking',
            description: 'Learn the 7 secrets of the greatest speakers in history.',
            category: 'Communication',
            youtubeId: '6gG_0_jS9W8',
            duration: '18 min',
        },
        {
            title: 'Mastering Confidence & Stage Presence',
            description: 'Techniques to overcome stage fright and speak with confidence.',
            category: 'Communication',
            youtubeId: 'JQbHnUa82a0',
            duration: '12 min',
        }
    ]

    console.log('Clearing old tutorials...')
    await prisma.tutorial.deleteMany()

    console.log('Adding updated tutorials...')
    for (const tutorial of tutorials) {
        await prisma.tutorial.create({
            data: tutorial,
        })
    }

    console.log('✅ Success! Videos have been updated.')
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
