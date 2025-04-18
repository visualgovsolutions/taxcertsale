import { AppDataSource, initializeDatabase } from '../src/config/database';
import { Repository } from 'typeorm';
import { Certificate } from '../src/models/entities/certificate.entity';
import { County } from '../src/models/entities/county.entity';
import { Property } from '../src/models/entities/property.entity';
import { certificateRepository } from '../src/repositories/certificate.repository';
import { v4 as uuidv4 } from 'uuid';

describe('CertificateRepository', () => {
  let certificateRepo: Repository<Certificate>;
  let countyRepo: Repository<County>;
  let propertyRepo: Repository<Property>;
  let county: County;
  let property: Property;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeDatabase();
    certificateRepo = AppDataSource.getRepository(Certificate);
    countyRepo = AppDataSource.getRepository(County);
    propertyRepo = AppDataSource.getRepository(Property);
  });

  beforeEach(async () => {
    // Clean up existing data
    await certificateRepo.createQueryBuilder().delete().execute();
    await propertyRepo.createQueryBuilder().delete().execute();
    await countyRepo.createQueryBuilder().delete().execute();
    
    // Create prerequisite county
    county = await countyRepo.save(
      countyRepo.create({
        name: `Test County ${uuidv4().substring(0, 8)}`,
        state: 'FL'
      })
    );
    
    // Create prerequisite property
    property = await propertyRepo.save(
      propertyRepo.create({
        parcelId: `P-${uuidv4().substring(0, 8)}`,
        address: '123 Test St',
        city: 'Test City',
        state: 'FL',
        zipCode: '12345',
        countyId: county.id
      })
    );
  });
  
  afterAll(async () => {
    // Final cleanup
    if (AppDataSource.isInitialized) {
      await certificateRepo.createQueryBuilder().delete().execute();
      await propertyRepo.createQueryBuilder().delete().execute();
      await countyRepo.createQueryBuilder().delete().execute();
      await AppDataSource.destroy();
    }
  });
  
  it('should create a certificate', async () => {
    const certData = {
      certificateNumber: `CERT-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.50,
      interestRate: 18.0,
      issueDate: new Date(),
      status: 'available',
      countyId: county.id,
      propertyId: property.id
    };
    
    const certificate = await certificateRepository.create(certData);
    
    expect(certificate).toBeDefined();
    expect(certificate.id).toBeDefined();
    expect(certificate.certificateNumber).toBe(certData.certificateNumber);
    expect(certificate.faceValue).toBe(certData.faceValue);
    expect(certificate.countyId).toBe(county.id);
    expect(certificate.propertyId).toBe(property.id);
  });
  
  it('should find all certificates', async () => {
    // Create test certificates
    const cert1 = await certificateRepository.create({
      certificateNumber: `CERT1-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.50,
      interestRate: 18.0,
      issueDate: new Date(),
      status: 'available',
      countyId: county.id,
      propertyId: property.id
    });
    
    const cert2 = await certificateRepository.create({
      certificateNumber: `CERT2-${uuidv4().substring(0, 8)}`,
      faceValue: 2000.75,
      interestRate: 16.0,
      issueDate: new Date(),
      status: 'available',
      countyId: county.id,
      propertyId: property.id
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
      faceValue: 1500.50,
      interestRate: 18.0,
      issueDate: new Date(),
      status: 'available',
      countyId: county.id,
      propertyId: property.id
    };
    
    const created = await certificateRepository.create(certData);
    const found = await certificateRepository.findById(created.id);
    
    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.certificateNumber).toBe(certData.certificateNumber);
  });
  
  it('should find certificates by county', async () => {
    // Create test certificate
    const cert = await certificateRepository.create({
      certificateNumber: `COUNTY-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.50,
      interestRate: 18.0,
      issueDate: new Date(),
      status: 'available',
      countyId: county.id,
      propertyId: property.id
    });
    
    const certificates = await certificateRepository.findByCounty(county.id);
    
    expect(certificates).toBeDefined();
    expect(certificates.length).toBeGreaterThanOrEqual(1);
    expect(certificates.find(c => c.id === cert.id)).toBeDefined();
  });
  
  it('should update a certificate', async () => {
    const certData = {
      certificateNumber: `UPDATE-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.50,
      interestRate: 18.0,
      issueDate: new Date(),
      status: 'available',
      countyId: county.id,
      propertyId: property.id
    };
    
    const created = await certificateRepository.create(certData);
    
    const updateData = {
      faceValue: 2000.75,
      interestRate: 16.5,
      status: 'sold'
    };
    
    const updated = await certificateRepository.update(created.id, updateData);
    
    expect(updated).toBeDefined();
    expect(updated!.id).toBe(created.id);
    expect(updated!.certificateNumber).toBe(certData.certificateNumber); // Shouldn't change
    expect(updated!.faceValue).toBe(updateData.faceValue);
    expect(updated!.interestRate).toBe(updateData.interestRate);
    expect(updated!.status).toBe(updateData.status);
  });
  
  it('should delete a certificate', async () => {
    const certData = {
      certificateNumber: `DELETE-${uuidv4().substring(0, 8)}`,
      faceValue: 1500.50,
      interestRate: 18.0,
      issueDate: new Date(),
      status: 'available',
      countyId: county.id,
      propertyId: property.id
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
      faceValue: 1500.50,
      interestRate: 18.0,
      issueDate: new Date(),
      status: 'available',
      countyId: county.id,
      propertyId: property.id
    };
    
    const created = await certificateRepository.create(certData);
    const withRelations = await certificateRepository.findWithRelations(created.id);
    
    expect(withRelations).toBeDefined();
    expect(withRelations!.id).toBe(created.id);
    expect(withRelations!.county).toBeDefined();
    expect(withRelations!.county.id).toBe(county.id);
    expect(withRelations!.property).toBeDefined();
    expect(withRelations!.property.id).toBe(property.id);
  });
});