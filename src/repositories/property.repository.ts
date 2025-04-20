import prisma from '../lib/prisma';
import { Prisma } from '../generated/prisma';
import type { Property } from '../generated/prisma';

class PropertyRepository {

  async findAll(): Promise<Property[]> {
    return prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string): Promise<Property | null> {
    return prisma.property.findUnique({ where: { id } });
  }

  async findByCounty(countyId: string): Promise<Property[]> {
    return prisma.property.findMany({
      where: { countyId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByParcelId(parcelId: string): Promise<Property | null> {
    return prisma.property.findUnique({ where: { parcelId } });
  }

  async findByAddress(address: string): Promise<Property[]> {
    return prisma.property.findMany({
      where: { address: { contains: address, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(propertyData: Prisma.PropertyCreateInput): Promise<Property> {
    return prisma.property.create({ data: propertyData });
  }

  async update(id: string, propertyData: Prisma.PropertyUpdateInput): Promise<Property | null> {
    try {
      return await prisma.property.update({
        where: { id },
        data: propertyData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      console.error("Error updating property:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.property.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      console.error("Error deleting property:", error);
      throw error;
    }
  }

  async findWithCertificates(id: string): Promise<Property | null> {
    return prisma.property.findUnique({
      where: { id },
      include: { certificates: true }
    });
  }

  async findWithCounty(id: string): Promise<Property | null> {
    return prisma.property.findUnique({
      where: { id },
      include: { county: true }
    });
  }

  async findWithRelations(id: string): Promise<Property | null> {
    return prisma.property.findUnique({
      where: { id },
      include: { county: true, certificates: true }
    });
  }

  async search(criteria: Prisma.PropertyWhereInput): Promise<Property[]> {
    return prisma.property.findMany({
      where: criteria,
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchProperties(
    searchParams: {
      countyId?: string;
      address?: string;
      parcelId?: string;
    }
  ): Promise<Property[]> {
    const whereClause: Prisma.PropertyWhereInput = {};

    if (searchParams.countyId) {
      whereClause.countyId = searchParams.countyId;
    }
    if (searchParams.address) {
      whereClause.address = { contains: searchParams.address, mode: 'insensitive' };
    }
    if (searchParams.parcelId) {
      whereClause.parcelId = { contains: searchParams.parcelId, mode: 'insensitive' };
    }

    return prisma.property.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const propertyRepository = new PropertyRepository();
export default propertyRepository; 