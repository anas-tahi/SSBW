import { PrismaConfig } from '@prisma/client';

export const config: PrismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
