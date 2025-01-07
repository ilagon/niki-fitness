import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import authRoutes from '../endpoints/auth.js';

// Mock Prisma client
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }))
}));

const prisma = new PrismaClient();

// Mock bcrypt with proper default export
vi.mock('bcrypt', async (importOriginal) => {
  const actual = await importOriginal<typeof bcrypt>();
  return {
    ...actual,
    default: {
      hash: vi.fn(),
      compare: vi.fn()
    }
  };
});

// Mock JWT secret
process.env.JWT_SECRET = 'test-secret';

describe('Auth Routes', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.route('/auth', authRoutes);
    vi.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const req = new Request('http://localhost/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const res = await app.request(req);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Email and password are required' });
    });

    it('should return 401 if user not found', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(null);
      
      const req = new Request('http://localhost/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'password' })
      });

      const res = await app.request(req);
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: 'Invalid credentials' });
    });

    it('should return 401 if password is invalid', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed-password',
        name: 'Test User'
      });
      (bcrypt.compare as Mock).mockResolvedValue(false);

      const req = new Request('http://localhost/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'wrong-password' })
      });

      const res = await app.request(req);
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: 'Invalid credentials' });
    });

    it('should return token and user data on successful login', async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed-password',
        name: 'Test User'
      };

      // Mock Prisma and bcrypt responses
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as Mock).mockResolvedValue(true);

      const req = new Request('http://localhost/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'correct-password' })
      });

      const res = await app.request(req);
      expect(res.status).toBe(200);
      
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(data.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name
      });
    });
  });

  describe('POST /auth/register', () => {
    it('should return 400 if email or password is missing', async () => {
      const req = new Request('http://localhost/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const res = await app.request(req);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Email and password are required' });
    });

    it('should return 400 if email already exists', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed-password',
        name: 'Test User'
      });

      const req = new Request('http://localhost/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'password', name: 'Test User' })
      });

      const res = await app.request(req);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Email already registered' });
    });

    it('should create user and return token on successful registration', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(null);
      (prisma.user.create as Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed-password',
        name: 'Test User'
      });
      (bcrypt.hash as Mock).mockResolvedValue('hashed-password');

      const req = new Request('http://localhost/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'password', name: 'Test User' })
      });

      const res = await app.request(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(data.user).toEqual({
        id: 1,
        email: 'test@test.com',
        name: 'Test User'
      });
    });
  });
});