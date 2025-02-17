import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { jwtMiddleware, getUserFromJWT } from '../middleware/auth.js';

const prisma = new PrismaClient();
const workoutRoutes = new Hono();

// Apply JWT middleware to all routes
workoutRoutes.use('/*', jwtMiddleware);

// Get all workouts for the authenticated user
workoutRoutes.get('/', async (c) => {
  try {
    const user = await getUserFromJWT(c);
    const routines = await prisma.routine.findMany({
      where: {
        createdById: user.id
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });
    const formatedRoutines = formatWorkoutNameList(routines);
    return c.json(formatedRoutines);
  } catch (error) {
    return c.json({ error: 'Failed to fetch workouts' }, 500);
  }
});

interface Routine {
  id: number;
  exercises: {
    exercise: {
      name: string;
    };
  }[];
  exerciseList?: string[];
}

type RoutineResponse = Omit<Routine, 'exercises'> & {
  exerciseList: string[];
};

function formatWorkoutNameList(routines: Routine[]): RoutineResponse[] {
  return routines.map((routine) => {
    const { exercises, ...routineWithoutExercises } = routine;
    const exerciseList = exercises.map(exercise => exercise.exercise.name);
    
    return {
      ...routineWithoutExercises,
      exerciseList
    };
  });
}

// Get workout by ID (only if user created it)
workoutRoutes.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  
  try {
    const user = await getUserFromJWT(c);
    const routine = await prisma.routine.findUnique({
      where: { 
        id,
        createdById: user.id // Only fetch if user created it
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    if (!routine) {
      return c.json({ error: 'Workout not found or unauthorized' }, 404);
    }

    return c.json(routine);
  } catch (error) {
    return c.json({ error: 'Failed to fetch workout' }, 500);
  }
});

// Create new workout
workoutRoutes.post('/', async (c) => {
  try {
    const user = await getUserFromJWT(c);
    const { name, description, exercises } = await c.req.json();
    
    const routine = await prisma.routine.create({
      data: {
        name,
        description,
        createdById: user.id,
        exercises: {
          create: exercises.map((exerciseId: number) => ({
            exercise: {
              connect: { id: exerciseId }
            }
          }))
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    return c.json(routine, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create workout' }, 500);
  }
});

// Update workout
workoutRoutes.put('/:id', async (c) => {
  try {
    const user = await getUserFromJWT(c);
    const id = parseInt(c.req.param('id'));
    const { name, description, exercises } = await c.req.json();

    // Check if the workout exists and belongs to the user
    const existingRoutine = await prisma.routine.findUnique({
      where: { 
        id,
        createdById: user.id // Only update if user created it
      }
    });

    if (!existingRoutine) {
      return c.json({ error: 'Workout not found or unauthorized' }, 404);
    }

    // Delete existing exercise relationships
    await prisma.routineExercise.deleteMany({
      where: { routineId: id }
    });

    // Update the routine and create new exercise relationships
    const updatedRoutine = await prisma.routine.update({
      where: { id },
      data: {
        name,
        description,
        exercises: {
          create: exercises.map((exerciseId: number) => ({
            exercise: {
              connect: { id: exerciseId }
            }
          }))
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    return c.json(updatedRoutine);
  } catch (error) {
    return c.json({ error: 'Failed to update workout' }, 500);
  }
});

// Delete workout
workoutRoutes.delete('/:id', async (c) => {
  try {
    const user = await getUserFromJWT(c);
    const id = parseInt(c.req.param('id'));

    // Check if the workout exists and belongs to the user
    const routine = await prisma.routine.findUnique({
      where: { 
        id,
        createdById: user.id // Only delete if user created it
      }
    });

    if (!routine) {
      return c.json({ error: 'Workout not found or unauthorized' }, 404);
    }

    // Delete the routine (this will cascade delete the RoutineExercise entries)
    await prisma.routine.delete({
      where: { id }
    });

    return c.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete workout' }, 500);
  }
});

export default workoutRoutes;