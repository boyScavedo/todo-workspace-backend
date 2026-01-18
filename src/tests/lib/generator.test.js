import JWT from 'jsonwebtoken'

import { workspaceInviteCodeGenerator, generateToken } from "../../lib/generator.js";

process.env.BYTE_SIZE = 10
process.env.JWT_SECRET_KEY = 'JWT_SECRET_KEY'

describe('Generator Utility Function Library', () => {
    describe('workspaceInviteCodeGenerator', () => {
        test('should generate hex string of the correct length', () => {
            const code = workspaceInviteCodeGenerator()

            expect(code).toHaveLength(20)
            expect(code).toMatch(/^[0-9a-f]+$/)
        })

        test('should not generate same code even after 5 loops', () => {
            const code1 = workspaceInviteCodeGenerator()
            const code2 = workspaceInviteCodeGenerator()

            expect(code1).not.toBe(code2)
        })
    })
    describe('generateToken', () => {
        test('should generate valid token', () => {
            const id = 'user-id'
            const token = generateToken(id)

            expect(token).toBeDefined()

            expect(token.split('.')).toHaveLength(3)
        })

        test('should contain correct payload when decoded', () => {
            const id = 'user-id'
            const token = generateToken(id)

            const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)

            expect(decoded.id).toBe(id)

            expect(decoded.exp).toBeDefined()

        })
    })
})