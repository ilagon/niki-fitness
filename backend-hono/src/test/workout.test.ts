import { PrismaClient } from '@prisma/client';
import { sign } from 'hono/jwt';
import { describe, it, beforeEach, afterAll, expect } from 'vitest';
import exerciseRoutes from '../endpoints/exercise.js';
import { Hono } from 'hono';
import { testClient } from 'hono/testing';

const prisma = new PrismaClient();

describe('routine Endpoints', () => {
  const app = new Hono().route('/api/routines', exerciseRoutes);
  const client = testClient(app) as ReturnType<typeof testClient>;
  let testUser: any;
  let testToken: string;
  let otherUser: any;
  let otherToken: string;
  let testExercise: any;

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

    // Create test exercise
    testExercise = await prisma.exercise.create({
      data: {
        name: 'Push-ups',
        description: 'Basic exercise',
        createdById: testUser.id
      }
    });
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  describe('GET /api/routines', () => {
    it('should return all routines for authenticated user', async () => {
      // Create test routine
      await prisma.routine.create({
        data: {
          name: 'Monday routine',
          description: 'Full body routine',
          createdById: testUser.id,
          exercises: {
            create: [{
              exerciseId: testExercise.id,
              // sets: 3,
              // reps: 10
            }]
          }
        }
      });

      const res = await client.get('/api/routines', {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Monday routine');
      expect(data[0].exercises).toHaveLength(1);
      expect(data[0].exercises[0].sets).toBe(3);
    });

    it('should not allow access without authentication', async () => {
      const res = await client.get('/api/routines');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/routines', () => {
    it('should create new routine for authenticated user', async () => {
      const res = await client.post('/api/routines', {
        headers: {
          Authorization: `Bearer ${testToken}`
        },
        json: {
          name: 'Monday routine',
          description: 'Full body routine',
          exercises: [{
            exerciseId: testExercise.id,
            sets: 3,
            reps: 10
          }]
        }
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.name).toBe('Monday routine');
      expect(data.exercises).toHaveLength(1);
      expect(data.exercises[0].sets).toBe(3);
      expect(data.createdBy.id).toBe(testUser.id);
    });

    it('should not create routine without required fields', async () => {
      const res = await client.post('/api/routines', {
        headers: {
          Authorization: `Bearer ${testToken}`
        },
        json: {
          description: 'Full body routine'
        }
      });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/routines/:id', () => {
    let testroutine: any;

    beforeEach(async () => {
      testroutine = await prisma.routine.create({
        data: {
          name: 'Monday routine',
          description: 'Full body routine',
          createdById: testUser.id,
          exercises: {
            create: [{
              exerciseId: testExercise.id,
              // sets: 3,
              // reps: 10
            }]
          }
        }
      });
    });

    it('should update routine if user is creator', async () => {
      const res = await client.put(`/api/routines/${testroutine.id}`, {
        headers: {
          Authorization: `Bearer ${testToken}`
        },
        json: {
          name: 'Updated routine',
          description: 'Updated description',
          exercises: [{
            exerciseId: testExercise.id,
            // sets: 4,
            // reps: 12
          }]
        }
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.name).toBe('Updated routine');
      expect(data.exercises[0].sets).toBe(4);
    });

    it('should not allow other users to update routine', async () => {
      const res = await client.put(`/api/routines/${testroutine.id}`, {
        headers: {
          Authorization: `Bearer ${otherToken}`
        },
        json: {
          name: 'Updated routine',
          description: 'Updated description'
        }
      });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/routines/:id', () => {
    let testroutine: any;

    beforeEach(async () => {
      testroutine = await prisma.routine.create({
        data: {
          name: 'Monday routine',
          description: 'Full body routine',
          createdById: testUser.id,
          exercises: {
            create: [{
              exerciseId: testExercise.id,
              // sets: 3,
              // reps: 10
            }]
          }
        }
      });
    });

    it('should delete routine if user is creator', async () => {
      const res = await client.delete(`/api/routines/${testroutine.id}`, {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      });

      expect(res.status).toBe(200);
      
      // Verify routine is deleted
      const routine = await prisma.routine.findUnique({
        where: { id: testroutine.id }
      });
      expect(routine).toBeNull();
    });

    it('should not allow other users to delete routine', async () => {
      const res = await client.delete(`/api/routines/${testroutine.id}`, {
        headers: {
          Authorization: `Bearer ${otherToken}`
        }
      });

      expect(res.status).toBe(403);
    });
  });
});
