import { PrismaClient } from '@prisma/client';
import { describe, it, beforeEach, afterAll, expect } from 'vitest';
import authRoutes from '../endpoints/auth.js';
import { Hono } from 'hono';
import { testClient } from 'hono/testing';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  const app = new Hono().route('/auth', authRoutes);
  const client = testClient(app) as ReturnType<typeof testClient>;

  // Helper function to clean up test data
  async function cleanupTestData() {
    await prisma.user.deleteMany();
  }

  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await client.post('/auth/register', {
        json: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        }
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.user.email).toBe('test@example.com');
      expect(data.user.name).toBe('Test User');
      expect(data.token).toBeDefined();

      // Verify password is hashed
      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });
      expect(user).not.toBeNull();
      const isValidPassword = await bcrypt.compare('password123', user!.password);
      expect(isValidPassword).toBe(true);
    });

    it('should not register user with existing email', async () => {
      // Create existing user
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Test User'
        }
      });

      const res = await client.post('/auth/register', {
        json: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        }
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('should not register user without required fields', async () => {
      const res = await client.post('/auth/register', {
        json: {
          name: 'Test User'
        }
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Test User'
        }
      });
    });

    it('should login user with correct credentials', async () => {
      const res = await client.post('/auth/login', {
        json: {
          email: 'test@example.com',
          password: 'password123'
        }
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email).toBe('test@example.com');
      expect(data.user.name).toBe('Test User');
      expect(data.token).toBeDefined();
    });

    it('should not login user with incorrect password', async () => {
      const res = await client.post('/auth/login', {
        json: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      });

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('should not login non-existent user', async () => {
      const res = await client.post('/auth/login', {
        json: {
          email: 'nonexistent@example.com',
          password: 'password123'
        }
      });

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });
  });
});
