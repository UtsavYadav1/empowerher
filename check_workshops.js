const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const count = await prisma.workshop.count()
    console.log(`Workshop count: ${count}`)
    const allWorkshops = await prisma.workshop.findMany()
    console.log(JSON.stringify(allWorkshops, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
