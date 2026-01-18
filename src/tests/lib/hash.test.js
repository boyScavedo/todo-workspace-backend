import bcrypt from 'bcryptjs'
import { hashPassword, comparePassword } from "../../lib/hash.js";
describe('Hash Utility Function Library', () => {
    describe('hashPassword', () => {
        test('is hashed password being generated', async () => {
        const hashedPassword = await hashPassword('Test Password')
        expect(hashedPassword.salt).toBeDefined()
        expect(hashedPassword.hash).toBeDefined()
        })
    })
})

describe('comparePassword', () => {
    test('is compare password working', async () => {
    const userHashedPassword = await hashPassword('Test Password')
    const comparison = await comparePassword('Test Password', userHashedPassword.hash)
    expect(comparison).toBeDefined()
})

    test('is compare password returning true when given valid password', async () => {
    const userHashedPassword = await hashPassword('Test Password')
    const comparison = await comparePassword('Test Password', userHashedPassword.hash)
    expect(comparison).toBe(true)
})

    test('is compare password returning true when given invalid password', async () => {
        const userHashedPassword = await hashPassword('Test Password')
        const comparison = await comparePassword("Test Incorrect Password", userHashedPassword.hash)
        expect(comparison).toBe(false)
    })
})

