import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { jwtMiddleware, getUserFromJWT } from "../middleware/auth.js";

const prisma = new PrismaClient();
const exerciseRoutes = new Hono();

type Exercise = {
  id: number;
  name: string;
  type: string;
  focus: string;
  weight: string;
  reps: string;
  time: string;
  sets: string;
  imageUrl: string;
  createdById: number;
};

// Apply JWT middleware to all routes
// exerciseRoutes.use("/*", jwtMiddleware);

// Get all exercises (accessible to all authenticated users)
exerciseRoutes.get("/", async (c) => {
  try {
    const exercises = await prisma.exercise.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return c.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return c.json({ error: "Failed to fetch exercises" }, 500);
  }
});

// Get exercise by ID (accessible to all authenticated users)
exerciseRoutes.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!exercise) {
      return c.json({ error: "Exercise not found" }, 404);
    }

    return c.json(exercise);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return c.json({ error: "Failed to fetch exercise" }, 500);
  }
});

// Create new exercise
exerciseRoutes.post("/", async (c) => {
  try {
    const user = await getUserFromJWT(c);
    const exerciseData: Exercise = await c.req.json();

    if (!exerciseData.name) {
      return c.json({ error: "Exercise name is required" }, 400);
    }

    const exercise = await prisma.exercise.create({
      data: {
        ...exerciseData,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return c.json(exercise, 201);
  } catch (error) {
    console.error("Error creating exercise:", error);
    return c.json({ error: "Failed to create exercise" }, 500);
  }
});

// Update exercise (only creator can update)
exerciseRoutes.put("/:id", async (c) => {
  try {
    const user = await getUserFromJWT(c);
    const id = parseInt(c.req.param("id"));
    const exerciseData: Exercise = await c.req.json();

    if (!exerciseData.name) {
      return c.json({ error: "Exercise name is required" }, 400);
    }

    // Check if exercise exists and belongs to user
    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) {
      return c.json({ error: "Exercise not found" }, 404);
    }

    if (existingExercise.createdById !== user.id) {
      return c.json({ error: "Unauthorized to edit this exercise" }, 403);
    }

    // Update the exercise
    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: exerciseData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return c.json(updatedExercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
    return c.json({ error: "Failed to update exercise" }, 500);
  }
});

// Delete exercise (only creator can delete)
exerciseRoutes.delete("/:id", async (c) => {
  try {
    const user = await getUserFromJWT(c);
    const id = parseInt(c.req.param("id"));

    // Check if exercise exists and belongs to user
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      return c.json({ error: "Exercise not found" }, 404);
    }

    if (exercise.createdById !== user.id) {
      return c.json({ error: "Unauthorized to delete this exercise" }, 403);
    }

    // Check if exercise is being used in any routines
    const routineCount = await prisma.routineExercise.count({
      where: { exerciseId: id },
    });

    if (routineCount > 0) {
      return c.json(
        {
          error:
            "Cannot delete exercise as it is being used in one or more routines",
        },
        400
      );
    }

    // Delete the exercise
    await prisma.exercise.delete({
      where: { id },
    });

    return c.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return c.json({ error: "Failed to delete exercise" }, 500);
  }
});

export default exerciseRoutes;
