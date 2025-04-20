import { DataSource, Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole, AccountStatus } from '../../../models/entities/user.entity';
import { Auction, AuctionStatus } from '../../../models/entities/auction.entity';
import { Certificate, CertificateStatus } from '../../../models/entities/certificate.entity';
import { County } from '../../../models/entities/county.entity';
import { Property } from '../../../models/entities/property.entity';
import { Bid, BidStatus } from '../../../models/entities/bid.entity';
import { TestDataSource } from '../../../config/database.test';

export interface TestEntityCreator<T extends ObjectLiteral> {
  create: (overrides?: DeepPartial<T>) => Promise<T>;
  createMany: (count: number, overrides?: DeepPartial<T>) => Promise<T[]>;
}

export const getTestEntityCreator = <T extends ObjectLiteral>(
  repository: Repository<T>,
  defaultData: DeepPartial<T>,
  relations: string[] = []
): TestEntityCreator<T> => {
  return {
    create: async (overrides: DeepPartial<T> = {} as DeepPartial<T>) => {
      const data = { ...defaultData, ...overrides } as DeepPartial<T>;
      const entity = repository.create(data);
      return repository.save(entity) as Promise<T>;
    },
    createMany: async (count: number, overrides: DeepPartial<T> = {} as DeepPartial<T>) => {
      const entities: DeepPartial<T>[] = [];
      for (let i = 0; i < count; i++) {
        const data = { 
          ...defaultData,
          ...overrides,
        } as DeepPartial<T>;
        const entity = repository.create(data);
        entities.push(entity);
      }
      return repository.save(entities) as Promise<T[]>;
    }
  };
};

export const createTestUser = (userRepo: Repository<User>) => 
  getTestEntityCreator(userRepo, {
    email: `test-${uuidv4()}@example.com`,
    passwordHash: 'hashedPassword',
    role: UserRole.INVESTOR,
    firstName: 'Test',
    lastName: 'User',
    phone: '1234567890',
    status: AccountStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date()
  });

export const createTestCounty = (countyRepo: Repository<County>) =>
  getTestEntityCreator(countyRepo, {
    name: `Test County ${uuidv4().substring(0, 8)}`,
    state: 'FL',
    createdAt: new Date(),
    updatedAt: new Date()
  });

export const createTestAuction = (auctionRepo: Repository<Auction>, countyId: string) =>
  getTestEntityCreator(auctionRepo, {
    name: `Test Auction ${uuidv4().substring(0, 8)}`,
    auctionDate: new Date(),
    startTime: '10:00:00',
    endTime: '14:00:00',
    status: AuctionStatus.UPCOMING,
    countyId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

export const createTestProperty = (propertyRepo: Repository<Property>, countyId: string) =>
  getTestEntityCreator(propertyRepo, {
    parcelId: `PID-${uuidv4().substring(0, 8)}`,
    address: '123 Test St',
    city: 'Test City',
    state: 'FL',
    zipCode: '12345',
    countyId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

export const createTestCertificate = (
  certificateRepo: Repository<Certificate>,
  { countyId, propertyId, auctionId }: { countyId: string; propertyId: string; auctionId: string }
) =>
  getTestEntityCreator(certificateRepo, {
    certificateNumber: `CERT-${uuidv4().substring(0, 8)}`,
    faceValue: 1000,
    interestRate: 18,
    issueDate: new Date(),
    status: CertificateStatus.AVAILABLE,
    countyId,
    propertyId,
    auctionId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

export const createTestBid = (
  bidRepo: Repository<Bid>,
  { userId, certificateId, auctionId }: { userId: string; certificateId: string; auctionId: string }
) =>
  getTestEntityCreator(bidRepo, {
    bidPercentage: 10.0,
    status: BidStatus.PENDING,
    userId,
    certificateId,
    auctionId,
    metadata: { note: 'Test bid' },
    createdAt: new Date(),
    updatedAt: new Date()
  });

export const setupTestRepositories = () => {
  return {
    userRepo: TestDataSource.getRepository(User),
    countyRepo: TestDataSource.getRepository(County),
    auctionRepo: TestDataSource.getRepository(Auction),
    propertyRepo: TestDataSource.getRepository(Property),
    certificateRepo: TestDataSource.getRepository(Certificate),
    bidRepo: TestDataSource.getRepository(Bid)
  };
};

export const createTestDependencies = async () => {
  const repos = setupTestRepositories();
  
  const user = await createTestUser(repos.userRepo).create();
  const county = await createTestCounty(repos.countyRepo).create();
  const auction = await createTestAuction(repos.auctionRepo, county.id).create();
  const property = await createTestProperty(repos.propertyRepo, county.id).create();
  const certificate = await createTestCertificate(repos.certificateRepo, {
    countyId: county.id,
    propertyId: property.id,
    auctionId: auction.id
  }).create();
  
  return {
    repos,
    entities: {
      user,
      county,
      auction,
      property,
      certificate
    }
  };
}; 