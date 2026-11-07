import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Safe fallback for static prerendering, testing, or CI environments when DATABASE_URL is not provided
const defaultFallbackUrl = "postgresql://postgres:postgres@localhost:5432/thailand_humanoid_atlas?schema=public";
const connectionString = process.env.DATABASE_URL || defaultFallbackUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    },
    log:
      process.env.PRISMA_LOG_LEVEL === "silent"
        ? []
        : process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
