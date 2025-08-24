import { PrismaClient } from '@prisma/client'

export class PrismaDatabase {
  private static instance: PrismaClient

  private constructor() {}

  static connection(): PrismaClient {
    if (!PrismaDatabase.instance) {
      PrismaDatabase.instance = new PrismaClient()
    }
    return PrismaDatabase.instance
  }
}