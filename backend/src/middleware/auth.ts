import { jwt } from 'hono/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cache user during auth process
let cachedUser: any = null;

// JWT middleware
export const jwtMiddleware = jwt({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  cookie: 'auth-token' // Optional: also check for token in cookies
});

// Helper to get user from JWT payload
export async function getUserFromJWT(c: any) {
  try {
    const payload = c.get('jwtPayload');
    if (!payload || !payload.id) {
      throw new Error('Invalid token payload');
    }

    // Clear previous cached user
    cachedUser = null;

    // Find user by ID from JWT
    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Cache user for later use
    cachedUser = user;
    return user;
  } catch (error) {
    console.error('JWT user fetch error:', error);
    throw error;
  }
}

// Get cached user
export function getCachedUser() {
  return cachedUser;
}
