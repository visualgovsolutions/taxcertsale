import { Bid, PrismaClient, Prisma } from '../generated/prisma';
import prisma from '../lib/prisma'; // Import the central Prisma client

class BidRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma; // Use the central Prisma client instance
  }

  async findAll(): Promise<Bid[]> {
    return this.prisma.bid.findMany({
      orderBy: { bidTime: 'desc' } // Order by time by default
    });
  }

  async findById(id: string): Promise<Bid | null> {
    return this.prisma.bid.findUnique({ where: { id } });
  }

  async findByAuction(auctionId: string): Promise<Bid[]> {
    return this.prisma.bid.findMany({ 
      where: { auctionId },
      orderBy: { bidTime: 'asc' } // Order by time within auction
    });
  }

  async findByCertificate(certificateId: string): Promise<Bid[]> {
    return this.prisma.bid.findMany({
      where: { certificateId },
      // Order by amount asc, then time asc for tie-breaking
      orderBy: [{ bidAmount: 'asc' }, { bidTime: 'asc' }], 
    });
  }

  async findByUser(userId: string): Promise<Bid[]> {
    return this.prisma.bid.findMany({
      where: { userId },
      orderBy: { bidTime: 'desc' }, // Order by time for user history
    });
  }

  // Prisma's create type expects data that matches the schema
  // Use Prisma.BidCreateInput for better type safety if possible
  async create(bidData: Prisma.BidUncheckedCreateInput): Promise<Bid> {
    return this.prisma.bid.create({ data: bidData }); 
  }

  // Prisma's update type expects data that matches the schema
  async update(id: string, bidData: Prisma.BidUpdateInput): Promise<Bid | null> { 
    try {
      return await this.prisma.bid.update({
        where: { id },
        data: bidData, 
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') { 
        return null; // Record to update not found
      }
      throw error; 
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.bid.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') { 
        return false; // Record to delete not found
      }
      throw error;
    }
  }

  // Removed findActiveByAuction as Bid model has no status field in schema
  /*
  async findActiveByAuction(auctionId: string): Promise<Bid[]> {
    return this.prisma.bid.findMany({ where: { auctionId, status: BidStatus.ACTIVE } });
  }
  */

  // Renamed from findLowestBidByCertificate, assumes lowest amount wins
  async findLowestBidByCertificate(certificateId: string): Promise<Bid | null> {
    return this.prisma.bid.findFirst({
      where: { certificateId },
      orderBy: { bidAmount: 'asc' }, // Order by amount only
    });
  }

  async findByIdWithUser(id: string): Promise<Bid | null> {
    return this.prisma.bid.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByIdWithRelations(id: string): Promise<Bid | null> {
    return this.prisma.bid.findUnique({
      where: { id },
      include: {
        user: true,
        certificate: true,
        auction: true,
      },
    });
  }

  // Assumes lowest bid amount wins, uses tie-breaking by time
  async findWinningBid(certificateId: string): Promise<Bid | null> {
    return this.prisma.bid.findFirst({
      where: { certificateId }, // Consider adding filter for auction status if relevant
      orderBy: [{ bidAmount: 'asc' }, { bidTime: 'asc' }], 
    });
  }

  async findWithRelations(id: string): Promise<Bid | null> {
    return this.prisma.bid.findUnique({
      where: { id },
      include: {
        user: true,
        certificate: true,
      },
    });
  }
}

// Export a single instance
export const bidRepository = new BidRepository();
export default bidRepository; // Keep default export if needed for compatibility
