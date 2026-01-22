import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting video interaction fix...')

    const tutorials = [
        {
            title: 'Business Planning 101 for Small Business (Hindi)',
            description: 'Learn how to plan your business effectively in Hindi. Covers basics of entrepreneurship.',
            category: 'Business',
            youtubeId: '3soVHA-f1zQ',
            duration: '17m:43s',
        },
        {
            title: 'Shop Business Plan Strategy (Hindi)',
            description: 'Complete guide to starting and managing a shop business in India.',
            category: 'Business',
            youtubeId: 'USQODi2_wGQ',
            duration: '13m:10s',
        },
        {
            title: 'Basic Computer Course for Beginners (Hindi)',
            description: 'A complete guide to understanding computer basics, from hardware to software.',
            category: 'Technology',
            youtubeId: 'agaLaSafbwc',
            duration: '1h:15m',
        },
        {
            title: 'Learn Office Automation (Hindi)',
            description: 'Master essential office tools like Word and Excel in Hindi.',
            category: 'Technology',
            youtubeId: 'EYvH_JM-3pI',
            duration: '12m:40s',
        },
        {
            title: 'Tailoring Guide: Salwar Cutting (Hindi)',
            description: 'Step-by-step tutorial on cutting and stitching a Salwar suit.',
            category: 'Arts',
            youtubeId: 'qxhXAOiwgvs',
            duration: '8m:38s',
        },
        {
            title: 'Beauty Parlor Course: Facial Theory (Hindi)',
            description: 'Professional beauty parlor course covering facial techniques and theory.',
            category: 'Arts',
            youtubeId: 'WMccJKQPVVg',
            duration: ' 13m:42s',
        },
        {
            title: 'Secrets of Great Public Speaking',
            description: 'Learn the 7 secrets of the greatest speakers in history.',
            category: 'Communication',
            youtubeId: 'svDVfU99igg',
            duration: '24m:42s',
        },
        {
            title: 'Mastering Confidence & Stage Presence',
            description: 'Techniques to overcome stage fright and speak with confidence.',
            category: 'Communication',
            youtubeId: 'EYvH_JM-3pI',
            duration: '12m:40s',
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
