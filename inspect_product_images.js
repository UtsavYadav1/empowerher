const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            title: true,
            images: true,
            category: true
        }
    })
    console.log('Total products:', products.length)
    products.forEach(p => {
        console.log(`[${p.id}] ${p.title} (${p.category})`)
        console.log('Images:', JSON.stringify(p.images))
        console.log('---')
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
