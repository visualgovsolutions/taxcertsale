import { GraphQLError } from 'graphql';
import resolvers from '../src/backend/graphql/resolvers';
import { GraphQLContext } from '../src/backend/graphql';
import type { Auction, County } from '../../src/generated/prisma';
import { v4 as uuidv4 } from 'uuid';
import { auctionRepository } from '../src/repositories/auction.repository';

// Define statuses/roles using strings (align with Prisma schema/app logic)
const AuctionStatus = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
};
const UserRole = {
  ADMIN: 'admin',
  INVESTOR: 'investor'
};

// Sample data aligned with Prisma schema
const sampleCounty: County = {
  id: 'county-123',
  name: 'Test County',
  state: 'FL',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sampleAuction: Auction & { county?: County } = {
  id: 'auction-456',
  auctionDate: new Date(),
  status: AuctionStatus.SCHEDULED,
  countyId: sampleCounty.id,
  adUrl: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Keep WebSocket mock if needed
jest.mock('../src/backend/websockets/auction.gateway', () => ({
  emitAuctionStateChange: jest.fn()
}));

// Test contexts (update roles to strings)
const adminContext: GraphQLContext = {
  user: { userId: 'admin-id', email: 'admin@test.com', role: UserRole.ADMIN },
  isAuthenticated: true
};

const investorContext: GraphQLContext = {
  user: { userId: 'investor-id', email: 'investor@test.com', role: UserRole.INVESTOR },
  isAuthenticated: true
};

const unauthenticatedContext: GraphQLContext = {
  user: undefined,
  isAuthenticated: false
};

describe('GraphQL Resolvers (with Repository Spy)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on and mock implementation for each repository method used by resolvers
    jest.spyOn(auctionRepository, 'findAll').mockResolvedValue([sampleAuction]);
    jest.spyOn(auctionRepository, 'findById').mockResolvedValue(sampleAuction);
    jest.spyOn(auctionRepository, 'findByCounty').mockResolvedValue([sampleAuction]);
    jest.spyOn(auctionRepository, 'findByStatus').mockResolvedValue([sampleAuction]);
    jest.spyOn(auctionRepository, 'findUpcoming').mockResolvedValue([sampleAuction]);
    jest.spyOn(auctionRepository, 'findActive').mockResolvedValue([sampleAuction]);
    jest.spyOn(auctionRepository, 'findCompleted').mockResolvedValue([sampleAuction]); // Maps to CLOSED status
    jest.spyOn(auctionRepository, 'create').mockImplementation((data) => Promise.resolve({ ...sampleAuction, ...data, id: uuidv4() } as Auction));
    jest.spyOn(auctionRepository, 'update').mockImplementation((id, data) => Promise.resolve({ ...sampleAuction, id, ...data } as Auction));
    jest.spyOn(auctionRepository, 'delete').mockResolvedValue(true);
    // Add mocks for transition methods if they are called directly by resolvers
    jest.spyOn(auctionRepository, 'activateAuction').mockResolvedValue({ ...sampleAuction, status: AuctionStatus.ACTIVE });
    jest.spyOn(auctionRepository, 'completeAuction').mockResolvedValue({ ...sampleAuction, status: AuctionStatus.CLOSED });
    jest.spyOn(auctionRepository, 'cancelAuction').mockResolvedValue({ ...sampleAuction, status: AuctionStatus.CANCELLED });
  });

  describe('Query Resolvers', () => {
    it('should return hello world', async () => {
      const result = await resolvers.Query.hello({}, {}, unauthenticatedContext);
      expect(result).toBe('Hello world!');
    });

    it('should fetch all auctions', async () => {
      const result = await resolvers.Query.auctions({}, {}, unauthenticatedContext);
      expect(result).toEqual([sampleAuction]);
      expect(auctionRepository.findAll).toHaveBeenCalled();
    });

    it('should fetch auction by id', async () => {
      const result = await resolvers.Query.auction({}, { id: 'auction-456' }, unauthenticatedContext);
      expect(result).toEqual(sampleAuction);
      expect(auctionRepository.findById).toHaveBeenCalledWith('auction-456');
    });

    it('should fetch auctions by status', async () => {
      const result = await resolvers.Query.auctionsByStatus({}, { status: AuctionStatus.SCHEDULED }, unauthenticatedContext);
      expect(result).toEqual([sampleAuction]);
      expect(auctionRepository.findByStatus).toHaveBeenCalledWith(AuctionStatus.SCHEDULED);
    });

    it('should fetch auction management data for admin', async () => {
       // Reset mocks specifically for this test if needed (spyOn handles this in beforeEach)
       jest.spyOn(auctionRepository, 'findActive').mockResolvedValueOnce([sampleAuction]); 
       jest.spyOn(auctionRepository, 'findUpcoming').mockResolvedValueOnce([sampleAuction]);
       jest.spyOn(auctionRepository, 'findCompleted').mockResolvedValueOnce([sampleAuction]);

       const result = await resolvers.Query.auctionManagementData({}, {}, adminContext);
       expect(result).toEqual({ 
         activeAuctions: 1,
         upcomingAuctions: 1,
         completedAuctions: 1,
         totalAuctions: 3 
       });
       expect(auctionRepository.findActive).toHaveBeenCalled();
       expect(auctionRepository.findUpcoming).toHaveBeenCalled();
       expect(auctionRepository.findCompleted).toHaveBeenCalled();
    });

    it('should reject auction management data for non-admin', async () => {
      await expect(
        resolvers.Query.auctionManagementData({}, {}, investorContext)
      ).rejects.toThrow(GraphQLError);
    });
  });

  describe('Mutation Resolvers', () => {
    describe('startAuction', () => {
      it('should start an auction when admin', async () => {
        jest.spyOn(auctionRepository, 'findById').mockResolvedValueOnce({ ...sampleAuction, status: AuctionStatus.SCHEDULED });
        // activateAuction spy is set in beforeEach

        const result = await resolvers.Mutation.startAuction(
          {},
          { id: 'auction-456' },
          adminContext
        );

        expect(result).not.toBeNull();
        expect(result!.status).toBe(AuctionStatus.ACTIVE);
        expect(auctionRepository.activateAuction).toHaveBeenCalledWith('auction-456');
      });

      it('should reject when non-admin tries to start auction', async () => {
        await expect(
          resolvers.Mutation.startAuction({}, { id: 'auction-456' }, investorContext)
        ).rejects.toThrow(GraphQLError);
        expect(auctionRepository.activateAuction).not.toHaveBeenCalled();
      });

      it('should reject when auction not found', async () => {
        jest.spyOn(auctionRepository, 'findById').mockResolvedValueOnce(null);

        await expect(
          resolvers.Mutation.startAuction({}, { id: 'not-found-id' }, adminContext)
        ).rejects.toThrow(/not found/i);
        expect(auctionRepository.activateAuction).not.toHaveBeenCalled();
      });

      it('should reject when auction is not in SCHEDULED status', async () => {
        jest.spyOn(auctionRepository, 'findById').mockResolvedValueOnce({ ...sampleAuction, status: AuctionStatus.ACTIVE });

        await expect(
          resolvers.Mutation.startAuction({}, { id: 'auction-456' }, adminContext)
        ).rejects.toThrow(/Cannot start auction with status/i);
        expect(auctionRepository.activateAuction).not.toHaveBeenCalled();
      });
    });

    describe('completeAuction', () => {
      it('should complete an active auction when admin', async () => {
        jest.spyOn(auctionRepository, 'findById').mockResolvedValueOnce({ ...sampleAuction, status: AuctionStatus.ACTIVE });
        // completeAuction spy set in beforeEach
        const result = await resolvers.Mutation.completeAuction(
          {},
          { id: 'auction-456' },
          adminContext
        );

        expect(result).not.toBeNull();
        expect(result!.status).toBe(AuctionStatus.CLOSED);
        expect(auctionRepository.completeAuction).toHaveBeenCalledWith('auction-456');
      });

      it('should reject when auction is not in ACTIVE status', async () => {
        jest.spyOn(auctionRepository, 'findById').mockResolvedValueOnce({ ...sampleAuction, status: AuctionStatus.SCHEDULED });

        await expect(
          resolvers.Mutation.completeAuction({}, { id: 'auction-456' }, adminContext)
        ).rejects.toThrow(/Cannot complete auction with status/i);
        expect(auctionRepository.completeAuction).not.toHaveBeenCalled();
      });
    });

    describe('cancelAuction', () => {
      it('should cancel a scheduled auction when admin', async () => {
        jest.spyOn(auctionRepository, 'findById').mockResolvedValueOnce({ ...sampleAuction, status: AuctionStatus.SCHEDULED });
         // cancelAuction spy set in beforeEach
        const result = await resolvers.Mutation.cancelAuction(
          {},
          { id: 'auction-456' },
          adminContext
        );

        expect(result).not.toBeNull();
        expect(result!.status).toBe(AuctionStatus.CANCELLED);
        expect(auctionRepository.cancelAuction).toHaveBeenCalledWith('auction-456');
      });

      it('should reject when auction is closed', async () => {
        jest.spyOn(auctionRepository, 'findById').mockResolvedValueOnce({ ...sampleAuction, status: AuctionStatus.CLOSED });

        await expect(
          resolvers.Mutation.cancelAuction({}, { id: 'auction-456' }, adminContext)
        ).rejects.toThrow(/Cannot cancel auction with status/i);
         expect(auctionRepository.cancelAuction).not.toHaveBeenCalled();
      });
    });
  });
});

afterAll(async () => {
  if (prisma && typeof prisma.$disconnect === 'function') {
    await prisma.$disconnect();
  }
}); 