const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const count = await prisma.workshop.count()
    console.log(`Workshop count: ${count}`)
    const first = await prisma.workshop.findFirst()
    console.log('First workshop sample:', JSON.stringify(first, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
