import { PrismaClient, Prisma } from '../generated/prisma';
import prisma from '../lib/prisma';

class CertificateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async create(data: Prisma.CertificateUncheckedCreateInput) {
    return this.prisma.certificate.create({ data });
  }

  async findById(id: string) {
    return this.prisma.certificate.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.CertificateUpdateInput) {
    try {
      return await this.prisma.certificate.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.certificate.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async findByCounty(countyId: string) {
    return this.prisma.certificate.findMany({ where: { countyId } });
  }

  async findByStatus(status: string) {
    const whereClause: Prisma.CertificateWhereInput = { status };
    return this.prisma.certificate.findMany({ where: whereClause });
  }

  async getCertificates(
    filter: {
      countyId?: string;
      status?: string;
      minFaceValue?: number;
      purchaseDate?: Date;
    } = {},
    pagination: { skip?: number; take?: number } = {},
    orderBy: Prisma.CertificateOrderByWithRelationInput = { createdAt: 'desc' }
  ) {
    const where: Prisma.CertificateWhereInput = {};

    if (filter.countyId) {
      where.countyId = filter.countyId;
    }
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.minFaceValue !== undefined) {
      where.faceValue = { gte: filter.minFaceValue };
    }
    if (filter.purchaseDate) {
      where.purchaseDate = { gte: filter.purchaseDate };
    }

    return this.prisma.certificate.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy,
      include: {
          county: true,
          property: true,
          auction: true,
          bids: true
      }
    });
  }
}

export default new CertificateRepository(); 