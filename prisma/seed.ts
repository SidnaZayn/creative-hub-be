import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // create or update a default category
  const category = await prisma.category.upsert({
    where: { name: "Default" },
    update: {
      name: "Default",
    },
    create: {
      name: "Default",
      id:"b94bcba6-491e-4952-8c17-bfc0fb430413"
    },
  });

  // create or update a default space and attach to the category
  const space = await prisma.space.upsert({
    where: { name: "Main Space", id: "b94bcba6-491e-4952-8c17-bfc0fb430413" },
    update: {
      name: "Main Space",
      description: "A default space for quick testing",
      categoryId: category.id,
    },
    create: {
      name: "Main Space",
      capacity: 10,
      ownerId: "b0939d8f-e903-4b66-a01e-46b38ae72176",
      pricePerHour: 0,
      description: "A default space for quick testing",
      // connect to category using relation field (adjust if your schema field name differs)
      category: { connect: { id: category.id } },
    },
  });

  // create a default space session for the created space if one doesn't exist at the same start time
  const start = new Date();
  const end = new Date(start.getTime() + 1000 * 60 * 60); // 1 hour later

  const existingSession = await prisma.spaceSession.findFirst({
    where: {
      spaceId: space.id,
    },
  });

  if (!existingSession) {
    await prisma.spaceSession.create({
      data: {
        space: { connect: { id: space.id } },
        startTime: start.toDateString(),
        endTime: end.toDateString(),
        day: "MONDAY",
        capacity: 8, // example field — adjust to your schema
        notes: "Default initial session",
      },
    });
  }

  console.log("Seed finished: category, space and space session ensured.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
