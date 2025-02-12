import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: 'password',
      name: 'John Doe',
    },
  });

  const exercises = [
    {
      name: 'Squats',
      type: 'Strength',
      focus: 'Legs',
      weight: '20kg',
      reps: '12',
      time: '60 seconds',
      sets: '3 sets',
      imageUrl: 'https://via.placeholder.com/100x60',
      createdById: user.id,
    },
    {
      name: 'Push Ups',
      type: 'Strength',
      focus: 'Chest',
      weight: 'Bodyweight',
      reps: '15',
      time: '30 seconds',
      sets: '3 sets',
      imageUrl: 'https://via.placeholder.com/100x60',
      createdById: user.id,
    },
    {
      name: 'Deadlifts',
      type: 'Strength',
      focus: 'Back',
      weight: '50kg',
      reps: '10',
      time: '60 seconds',
      sets: '3 sets',
      imageUrl: 'https://via.placeholder.com/100x60',
      createdById: user.id,
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.create({ data: exercise });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
