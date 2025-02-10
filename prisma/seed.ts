import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Authors
  await prisma.author.createMany({
    data: [{ name: 'John Doe' }, { name: 'Jane Smith' }],
    skipDuplicates: true,
  });

  // Fetch authors since createMany doesn't return values
  const authors = await prisma.author.findMany();
  const john = authors.find((a) => a.name === 'John Doe');
  const jane = authors.find((a) => a.name === 'Jane Smith');

  if (!john || !jane) {
    throw new Error('Authors not found after creation');
  }

  // Insert root guides
  await prisma.guide.createMany({
    data: [
      { title: 'Software Engineering', slug: 'software-engineering', order: 1, authorId: john.id },
      { title: 'Physics', slug: 'physics', order: 2, authorId: jane.id },
    ],
    skipDuplicates: true,
  });

  // Fetch root guides
  const rootGuides = await prisma.guide.findMany();
  const se = rootGuides.find((g) => g.slug === 'software-engineering');
  const physics = rootGuides.find((g) => g.slug === 'physics');

  if (!se || !physics) {
    throw new Error('Root guides not found after creation');
  }

  // Insert SE child guides
  await prisma.guide.createMany({
    data: [
      { title: 'Requirements', slug: 'requirements', parentId: se.id, order: 1, authorId: john.id },
      { title: 'Development', slug: 'development', parentId: se.id, order: 2, authorId: john.id },
      { title: 'Testing', slug: 'testing', parentId: se.id, order: 3, authorId: john.id },
    ],
    skipDuplicates: true,
  });

  // Fetch "Development" guide for further hierarchy
  const devGuide = await prisma.guide.findFirst({ where: { slug: 'development' } });

  if (devGuide) {
    await prisma.guide.createMany({
      data: [
        { title: 'Frontend', slug: 'frontend', parentId: devGuide.id, order: 1, authorId: john.id },
        { title: 'Backend', slug: 'backend', parentId: devGuide.id, order: 2, authorId: john.id },
      ],
      skipDuplicates: true,
    });
  }

  // Insert Physics child guides
  await prisma.guide.createMany({
    data: [
      { title: 'Classical Mechanics', slug: 'classical-mechanics', parentId: physics.id, order: 1, authorId: jane.id },
      { title: 'Quantum Mechanics', slug: 'quantum-mechanics', parentId: physics.id, order: 2, authorId: jane.id },
      { title: 'Relativity', slug: 'relativity', parentId: physics.id, order: 3, authorId: jane.id },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
