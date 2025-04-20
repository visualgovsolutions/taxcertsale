import prisma from '../lib/prisma'; // Import the central Prisma client
import { Prisma } from '../generated/prisma'; // Import Auction type as type, but Prisma namespace as value
import type { Auction } from '../generated/prisma'; // Import Auction type as type, but Prisma namespace as value

/**
 * Auction State Machine
 * 
 * This repository implements a state machine for auction status transitions:
 * 
 * Valid Transitions:
 * - UPCOMING -> ACTIVE (via activateAuction)
 * - ACTIVE -> COMPLETED (via completeAuction)
 * - UPCOMING -> CANCELLED (via cancelAuction)
 * - ACTIVE -> CANCELLED (via cancelAuction)
 * 
 * Invalid Transitions (will return null):
 * - COMPLETED -> Any other state
 * - CANCELLED -> Any other state
 * - ACTIVE -> UPCOMING
 * - Any auction that doesn't exist
 * 
 * State Effects:
 * - Only ACTIVE auctions can accept bids
 * - UPCOMING auctions are in preparation phase
 * - COMPLETED auctions are finalized and read-only
 * - CANCELLED auctions are terminated prematurely and read-only
 */
class AuctionRepository {
  async findAll(): Promise<Auction[]> {
    return prisma.auction.findMany();
  }

  async findById(id: string): Promise<Auction | null> {
    return prisma.auction.findUnique({ where: { id } });
  }

  async findByCounty(countyId: string): Promise<Auction[]> {
    return prisma.auction.findMany({ where: { countyId } });
  }

  async findByStatus(status: string): Promise<Auction[]> {
    return prisma.auction.findMany({ where: { status } });
  }

  async findUpcoming(): Promise<Auction[]> {
    return prisma.auction.findMany({
      where: { status: 'scheduled' },
      orderBy: { auctionDate: 'asc' }
    });
  }

  async findActive(): Promise<Auction[]> {
    return prisma.auction.findMany({
      where: { status: 'active' },
      orderBy: { auctionDate: 'asc' }
    });
  }

  async findCompleted(): Promise<Auction[]> {
    return prisma.auction.findMany({
      where: { status: 'closed' },
      orderBy: { auctionDate: 'desc' }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Auction[]> {
    return prisma.auction.findMany({
      where: { auctionDate: { gte: startDate, lte: endDate } },
      orderBy: { auctionDate: 'asc' }
    });
  }

  async findUpcomingByDateRange(startDate: Date, endDate: Date): Promise<Auction[]> {
    return prisma.auction.findMany({
      where: {
        auctionDate: { gte: startDate, lte: endDate },
        status: 'scheduled'
      },
      orderBy: { auctionDate: 'asc' }
    });
  }

  async findBeforeDate(date: Date): Promise<Auction[]> {
    return prisma.auction.findMany({
      where: { auctionDate: { lte: date } },
      orderBy: { auctionDate: 'desc' }
    });
  }

  async findAfterDate(date: Date): Promise<Auction[]> {
    return prisma.auction.findMany({
      where: { auctionDate: { gte: date } },
      orderBy: { auctionDate: 'asc' }
    });
  }

  async create(auctionData: Prisma.AuctionCreateInput): Promise<Auction> {
    return prisma.auction.create({ data: auctionData });
  }

  async update(id: string, auctionData: Prisma.AuctionUpdateInput): Promise<Auction | null> {
    try {
      return await prisma.auction.update({
        where: { id },
        data: auctionData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      console.error("Error updating auction:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.auction.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      console.error("Error deleting auction:", error);
      throw error;
    }
  }

  async findWithCertificates(id: string): Promise<Auction | null> {
    return prisma.auction.findUnique({
      where: { id },
      include: { certificates: true }
    });
  }

  async findWithCounty(id: string): Promise<Auction | null> {
    return prisma.auction.findUnique({
      where: { id },
      include: { county: true }
    });
  }

  async findWithRelations(id: string): Promise<Auction | null> {
    return prisma.auction.findUnique({
      where: { id },
      include: { county: true, certificates: true }
    });
  }

  async activateAuction(id: string): Promise<Auction | null> {
    try {
      return await prisma.auction.update({
        where: { id: id, status: 'scheduled' },
        data: { status: 'active' },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.warn(`Auction ${id} not found or not in scheduled state for activation.`);
        return null;
      }
      console.error("Error activating auction:", error);
      throw error;
    }
  }

  async completeAuction(id: string): Promise<Auction | null> {
    try {
      return await prisma.auction.update({
        where: { id: id, status: 'active' },
        data: { status: 'closed' },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.warn(`Auction ${id} not found or not in active state for completion.`);
        return null;
      }
      console.error("Error completing auction:", error);
      throw error;
    }
  }

  async cancelAuction(id: string): Promise<Auction | null> {
    try {
      const auction = await this.findById(id);
      if (!auction) {
        console.warn(`Auction ${id} not found for cancellation.`);
        return null;
      }
      if (auction.status !== 'scheduled' && auction.status !== 'active') {
        console.warn(`Auction ${id} cannot be cancelled from status ${auction.status}.`);
        return null;
      }
      return await prisma.auction.update({
        where: { id: id },
        data: { status: 'cancelled' },
      });
    } catch (error) {
      console.error("Error cancelling auction:", error);
      throw error;
    }
  }
}

export const auctionRepository = new AuctionRepository();
export default auctionRepository;
