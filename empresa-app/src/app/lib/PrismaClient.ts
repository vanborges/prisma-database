// src/app/prismaClient.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Habilitar diferentes níveis de log
  });  

export default prisma;