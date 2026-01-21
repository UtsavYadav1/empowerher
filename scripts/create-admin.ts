import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer)
        })
    })
}

async function main() {
    console.log('\n--- Admin/Agent Account Creator ---\n')

    try {
        const name = await question('Enter Full Name: ')
        const phone = await question('Enter Phone Number: ')
        const email = await question('Enter Email (optional, press Enter to skip): ')
        const password = await question('Enter Password: ')

        console.log('\nSelect Role:')
        console.log('1. Admin')
        console.log('2. Field Agent')
        const roleSelection = await question('Enter choice (1 or 2): ')

        let role = ''
        if (roleSelection === '1') role = 'admin'
        else if (roleSelection === '2') role = 'fieldagent'
        else {
            console.error('Invalid role selected.')
            process.exit(1)
        }

        if (!name || !phone || !password) {
            console.error('Error: Name, Phone, and Password are required.')
            process.exit(1)
        }

        // Check existing
        const existingUser = await prisma.user.findFirst({
            where: { phone }
        })

        if (existingUser) {
            console.error(`\nError: User with phone ${phone} already exists.`)
            process.exit(1)
        }

        console.log(`\nCreating ${role} account for ${name}...`)

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                email: email || null,
                password, // Note: In a real app, hash this!
                role,
                verified: true,
                village: 'Headquarters'
            }
        })

        console.log(`\n✅ Success! Account created for ${user.name} (${user.role}).`)
        console.log(`ID: ${user.id}`)
        console.log(`Phone: ${user.phone}`)

    } catch (error) {
        console.error('\nError creating user:', error)
    } finally {
        rl.close()
        await prisma.$disconnect()
    }
}

main()
