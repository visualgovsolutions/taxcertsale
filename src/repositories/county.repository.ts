import prisma from '../lib/prisma';
import { Prisma } from '../generated/prisma';
import type { County } from '../generated/prisma';

class CountyRepository {
  async findAll(): Promise<County[]> {
    return prisma.county.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string): Promise<County | null> {
    return prisma.county.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<County | null> {
    return prisma.county.findUnique({ where: { name } });
  }

  async findByState(state: string): Promise<County[]> {
    return prisma.county.findMany({ where: { state } });
  }

  async create(countyData: Prisma.CountyCreateInput): Promise<County> {
    return prisma.county.create({ data: countyData });
  }

  async update(id: string, countyData: Prisma.CountyUpdateInput): Promise<County | null> {
    try {
      return await prisma.county.update({
        where: { id },
        data: countyData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      console.error("Error updating county:", error);
      throw error; 
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.county.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      console.error("Error deleting county:", error);
      throw error; 
    }
  }

  async findWithProperties(id: string): Promise<County | null> {
    return prisma.county.findUnique({
      where: { id },
      include: { properties: true }
    });
  }

  async findWithCertificates(id: string): Promise<County | null> {
    return prisma.county.findUnique({
      where: { id },
      include: { certificates: true }
    });
  }

  async findWithAuctions(id: string): Promise<County | null> {
    return prisma.county.findUnique({
      where: { id },
      include: { auctions: true }
    });
  }

  async findWithRelations(id: string): Promise<County | null> {
    return prisma.county.findUnique({
      where: { id },
      include: { properties: true, auctions: true, certificates: true }
    });
  }
}

export const countyRepository = new CountyRepository();
export default countyRepository; 