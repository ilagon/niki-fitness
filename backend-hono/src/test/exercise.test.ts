import { PrismaClient } from '@prisma/client';
import { sign } from 'hono/jwt';
import { describe, it, beforeEach, afterAll, expect } from 'vitest';
import exerciseRoutes from '../endpoints/exercise.js';
import { Hono } from 'hono';
import { testClient } from 'hono/testing';

const prisma = new PrismaClient();

describe('Exercise Endpoints', () => {
  const app = new Hono().route('/api/exercises', exerciseRoutes);
  const client = testClient(app) as ReturnType<typeof testClient>;
  let testUser: any;
  let testToken: string;
  let otherUser: any;
  let otherToken: string;

  // Helper function to clean up test data
  async function cleanupTestData() {
    await prisma.routineExercise.deleteMany();
    await prisma.routine.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
  }

  // Helper function to create test token
  async function createTestToken(userId: number, email: string) {
    return sign({ id: userId, email }, process.env.JWT_SECRET || 'test-secret');
  }

  beforeEach(async () => {
    await cleanupTestData();
    
    // Create test users and tokens
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      }
    });
    testToken = await createTestToken(testUser.id, testUser.email);
    
    otherUser = await prisma.user.create({
      data: {
        email: 'other@example.com',
        password: 'hashedpassword',
        name: 'Other User'
      }
    });
    otherToken = await createTestToken(otherUser.id, otherUser.email);
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  describe('GET /api/exercises', () => {
    it('should return all exercises for authenticated user', async () => {
      // Create test exercise
      await prisma.exercise.create({
        data: {
          name: 'Push-ups',
          description: 'Basic exercise',
          createdById: testUser.id
        }
      });

      const res = await client.get('/api/exercises', {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Push-ups');
    });

    it('should not allow access without authentication', async () => {
      const res = await client.get('/api/exercises');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/exercises', () => {
    it('should create new exercise for authenticated user', async () => {
      const res = await client.post('/api/exercises', {
        headers: {
          Authorization: `Bearer ${testToken}`
        },
        json: {
          name: 'Push-ups',
          description: 'Basic exercise'
        }
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.name).toBe('Push-ups');
      expect(data.createdBy.id).toBe(testUser.id);
    });

    it('should not create exercise without required fields', async () => {
      const res = await client.post('/api/exercises', {
        headers: {
          Authorization: `Bearer ${testToken}`
        },
        json: {
          description: 'Basic exercise'
        }
      });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/exercises/:id', () => {
    let testExercise: any;

    beforeEach(async () => {
      testExercise = await prisma.exercise.create({
        data: {
          name: 'Push-ups',
          description: 'Basic exercise',
          createdById: testUser.id
        }
      });
    });

    it('should update exercise if user is creator', async () => {
      const res = await client.put(`/api/exercises/${testExercise.id}`, {
        headers: {
          Authorization: `Bearer ${testToken}`
        },
        json: {
          name: 'Updated Push-ups',
          description: 'Updated description'
        }
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.name).toBe('Updated Push-ups');
    });

    it('should not allow other users to update exercise', async () => {
      const res = await client.put(`/api/exercises/${testExercise.id}`, {
        headers: {
          Authorization: `Bearer ${otherToken}`
        },
        json: {
          name: 'Updated Push-ups',
          description: 'Updated description'
        }
      });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/exercises/:id', () => {
    let testExercise: any;

    beforeEach(async () => {
      testExercise = await prisma.exercise.create({
        data: {
          name: 'Push-ups',
          description: 'Basic exercise',
          createdById: testUser.id
        }
      });
    });

    it('should delete exercise if user is creator', async () => {
      const res = await client.delete(`/api/exercises/${testExercise.id}`, {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      });

      expect(res.status).toBe(200);
      
      // Verify exercise is deleted
      const exercise = await prisma.exercise.findUnique({
        where: { id: testExercise.id }
      });
      expect(exercise).toBeNull();
    });

    it('should not allow other users to delete exercise', async () => {
      const res = await client.delete(`/api/exercises/${testExercise.id}`, {
        headers: {
          Authorization: `Bearer ${otherToken}`
        }
      });

      expect(res.status).toBe(403);
    });

    it('should not delete exercise if used in routine', async () => {
      // Create routine with exercise
      await prisma.routine.create({
        data: {
          name: 'Test Routine',
          createdById: testUser.id,
          exercises: {
            create: [{
              exercise: {
                connect: { id: testExercise.id }
              }
            }]
          }
        }
      });

      const res = await client.delete(`/api/exercises/${testExercise.id}`, {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('Cannot delete exercise');
    });
  });
});
