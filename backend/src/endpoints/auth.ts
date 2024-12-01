import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { sign } from 'hono/jwt';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const authRoutes = new Hono();

// Login endpoint using Basic Auth
authRoutes.post('/login', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Authorization header missing' }, 401);
    }

    // Extract credentials from Basic Auth header
    const [, credentials] = authHeader.split(' ');
    const [email] = Buffer.from(credentials, 'base64').toString().split(':');

    // Get user data
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 401);
    }

    // Generate JWT token
    const token = await sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_SECRET || 'your-secret-key');

    // Return user data and token
    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Registration endpoint
authRoutes.post('/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    });

    // Generate JWT token
    const token = await sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_SECRET || 'your-secret-key');

    // Return user data and token
    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default authRoutes;
