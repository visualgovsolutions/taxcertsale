import { AppDataSource, initializeDatabase } from '../src/config/database';
import { Repository } from 'typeorm';
import { Certificate } from '../src/models/entities/certificate.entity';
import { County } from '../src/models/entities/county.entity';
import { Property } from '../src/models/entities/property.entity';
import { certificateRepository } from '../src/repositories/certificate.repository';
import { v4 as uuidv4 } from 'uuid';
import { Auction } from '../src/models/entities/auction.entity';
import { auctionRepository } from '../src/repositories/auction.repository';
import { CertificateStatus } from '../src/models/entities/certificate.entity';
import { AuctionStatus } from '../src/models/entities/auction.entity';
import { Bid } from '../src/models/entities/bid.entity';

describe('CertificateRepository', () => {
  let certificateRepo: Repository<Certificate>;
  let countyRepo: Repository<County>;
  let propertyRepo: Repository<Property>;
  let auctionRepo: Repository<Auction>;
  let bidRepo: Repository<Bid>;
  let county: County;
  let property: Property;
  let auction: Auction;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeDatabase();
    certificateRepo = AppDataSource.getRepository(Certificate);
    countyRepo = AppDataSource.getRepository(County);
    propertyRepo = AppDataSource.getRepository(Property);
    auctionRepo = AppDataSource.getRepository(Auction);
    bidRepo = AppDataSource.getRepository(Bid);
  });

  beforeEach(async () => {
    // Clean up in correct order: bids -> certificates -> auctions -> properties -> counties
    await bidRepo.createQueryBuilder().delete().execute();
    await certificateRepo.createQueryBuilder().delete().execute();
    await auctionRepo.createQueryBuilder().delete().execute();
    await propertyRepo.createQueryBuilder().delete().execute();
    await countyRepo.createQueryBuilder().delete().execute();

    // Create prerequisites in order, ensuring objects are used for relations
    county = await countyRepo.save(
      countyRepo.create({
        name: `Test County ${uuidv4().substring(0, 8)}`,
        state: 'FL',
      })
    );
    console.log('[Cert Test Prep] Saved County ID:', county.id);

    property = await propertyRepo.save(
      propertyRepo.create({
        parcelId: `P-${uuidv4().substring(0, 8)}`,
        address: '123 Test St',
        city: 'Test City',
        state: 'FL',
        zipCode: '12345',
        county: county,
      })
    );
    console.log(
      '[Cert Test Prep] Saved Property ID:',
      property.id,
      'County ID:',
      property.countyId
    );

    auction = await auctionRepo.save(
      auctionRepo.create({
        name: `Test Auction ${uuidv4().substring(0, 8)}`,
        auctionDate: new Date(),
        startTime: '09:00:00',
        endTime: '17:00:00',
        status: AuctionStatus.ACTIVE,
        county: county,
      })
    );
    console.log('[Cert Test Prep] Saved Auction ID:', auction.id, 'County ID:', auction.countyId);
  });

  afterAll(async () => {
    // Final cleanup in correct order: bids -> certificates -> auctions -> properties -> counties
    if (AppDataSource.isInitialized) {
      await bidRepo.createQueryBuilder().delete().execute();
      await certificateRepo.createQueryBuilder().delete().execute();
      await auctionRepo.createQueryBuilder().delete().execute();
      await propertyRepo.createQueryBuilder().delete().execute();
      await countyRepo.createQueryBuilder().delete().execute();
      await AppDataSource.destroy();
    }
  });

  it('should create a certificate', async () => {
    const certData = {
      certificateNumber: `CERT-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.5,
      interestRate: 18.0,
      issueDate: new Date(),
      status: CertificateStatus.AVAILABLE,
      county: county,
      property: property,
      auction: auction,
    };

    const certificate = await certificateRepository.create(certData);

    expect(certificate).toBeDefined();
    expect(certificate.id).toBeDefined();
    expect(certificate.certificateNumber).toBe(certData.certificateNumber);
    expect(certificate.faceValue).toBe(certData.faceValue);
    expect(certificate.countyId).toBe(county.id);
    expect(certificate.propertyId).toBe(property.id);
    expect(certificate.auctionId).toBe(auction.id);
  });

  it('should find all certificates', async () => {
    // Create test certificates
    const cert1 = await certificateRepository.create({
      certificateNumber: `CERT1-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.5,
      interestRate: 18.0,
      issueDate: new Date(),
      status: CertificateStatus.AVAILABLE,
      county: county,
      property: property,
      auction: auction,
    });

    const cert2 = await certificateRepository.create({
      certificateNumber: `CERT2-${uuidv4().substring(0, 8)}`,
      faceValue: 2000.75,
      interestRate: 16.0,
      issueDate: new Date(),
      status: CertificateStatus.AVAILABLE,
      county: county,
      property: property,
      auction: auction,
    });

    const certificates = await certificateRepository.findAll();

    expect(certificates).toBeDefined();
    expect(certificates.length).toBeGreaterThanOrEqual(2);
    expect(certificates.find(c => c.id === cert1.id)).toBeDefined();
    expect(certificates.find(c => c.id === cert2.id)).toBeDefined();
  });

  it('should find a certificate by id', async () => {
    const certData = {
      certificateNumber: `FIND-ID-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.5,
      interestRate: 18.0,
      issueDate: new Date(),
      status: CertificateStatus.AVAILABLE,
      county: county,
      property: property,
      auction: auction,
    };

    const created = await certificateRepository.create(certData);
    const found = await certificateRepository.findById(created.id);

    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.certificateNumber).toBe(certData.certificateNumber);
    expect(found!.auctionId).toBe(auction.id);
  });

  it('should find certificates by county', async () => {
    // Create test certificate
    const cert = await certificateRepository.create({
      certificateNumber: `COUNTY-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.5,
      interestRate: 18.0,
      issueDate: new Date(),
      status: CertificateStatus.AVAILABLE,
      county: county,
      property: property,
      auction: auction,
    });

    const certificates = await certificateRepository.findByCounty(county.id);

    expect(certificates).toBeDefined();
    expect(certificates.length).toBeGreaterThanOrEqual(1);
    expect(certificates.find(c => c.id === cert.id)).toBeDefined();
  });

  it('should update a certificate', async () => {
    const certData = {
      certificateNumber: `UPDATE-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.5,
      interestRate: 18.0,
      issueDate: new Date(),
      status: CertificateStatus.AVAILABLE,
      county: county,
      property: property,
      auction: auction,
    };

    const created = await certificateRepository.create(certData);

    const updateData = {
      faceValue: 2000.75,
      interestRate: 16.5,
      status: CertificateStatus.SOLD,
    };

    const updated = await certificateRepository.update(created.id, updateData);

    expect(updated).toBeDefined();
    expect(updated!.id).toBe(created.id);
    expect(updated!.certificateNumber).toBe(certData.certificateNumber); // Shouldn't change
    expect(Number(updated!.faceValue)).toBe(Number(updateData.faceValue));
    expect(Number(updated!.interestRate)).toBe(Number(updateData.interestRate));
    expect(updated!.status).toBe(updateData.status);
    expect(updated!.auctionId).toBe(auction.id);
  });

  it('should delete a certificate', async () => {
    const certData = {
      certificateNumber: `DELETE-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.5,
      interestRate: 18.0,
      issueDate: new Date(),
      status: CertificateStatus.AVAILABLE,
      county: county,
      property: property,
      auction: auction,
    };

    const created = await certificateRepository.create(certData);
    const deleteResult = await certificateRepository.delete(created.id);

    expect(deleteResult).toBe(true);

    const found = await certificateRepository.findById(created.id);
    expect(found).toBeNull();
  });

  it('should find certificates with relations', async () => {
    const certData = {
      certificateNumber: `RELATIONS-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.5,
      interestRate: 18.0,
      issueDate: new Date(),
      status: CertificateStatus.AVAILABLE,
      county: county,
      property: property,
      auction: auction,
    };

    const created = await certificateRepository.create(certData);
    const withRelations = await certificateRepository.findWithRelations(created.id);

    expect(withRelations).toBeDefined();
    expect(withRelations!.id).toBe(created.id);
    expect(withRelations!.county).toBeDefined();
    expect(withRelations!.county.id).toBe(county.id);
    expect(withRelations!.property).toBeDefined();
    expect(withRelations!.property.id).toBe(property.id);
    expect(withRelations!.auction).toBeDefined();
    expect(withRelations!.auction.id).toBe(auction.id);
  });
});
