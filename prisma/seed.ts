import { createSeedClient, seedAtlasData } from "../lib/seed-importer";
import { seedWellnessCases } from "../scripts/seed-wellness-cases";

const prisma = createSeedClient();

seedAtlasData(prisma)
  .then(() => seedWellnessCases(prisma))
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
