import { verifyAccessToken } from '../../src/utils/jwt';
import jwt from 'jsonwebtoken';

describe('JWT Utils', () => {
    const mockPayload = { sub: 'user-123', email: 'test@example.com', role: 'USER' };

    let generateAccessToken: (payload: any) => string;

    beforeAll(async () => {
        process.env.JWT_ACCESS_SECRET = 'test-secret';
        jest.resetModules();
        const jwtUtils = await import('../../src/utils/jwt');
        generateAccessToken = jwtUtils.generateAccessToken;
    });

    describe('generateAccessToken', () => {
        it('should generate a valid JWT token', () => {
            const token = generateAccessToken(mockPayload);
            expect(typeof token).toBe('string');

            const decoded = jwt.verify(token, 'test-secret');
            expect((decoded as any).sub).toBe(mockPayload.sub);
        });
    });

    //   describe('verifyAccessToken', () => {
    //     it('should verify a valid token', () => {
    //       const token = jwt.sign(mockPayload, 'test-secret');
    //       const decoded = verifyAccessToken(token);
    //       expect(decoded.sub).toBe(mockPayload.sub);
    //     });

    //     it('should throw error for invalid token', () => {
    //       expect(() => {
    //         verifyAccessToken('invalid-token');
    //       }).toThrow();
    //     });
    //   });
});
