const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Deleting all products as requested by user...')
    const deleted = await prisma.product.deleteMany({})
    console.log(`Deleted ${deleted.count} products.`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
