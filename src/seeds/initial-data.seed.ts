import { Connection } from 'typeorm';
import { User } from '../models/entities/user.entity';
import { UserRole } from '../models/entities/user.entity';
import { County } from '../models/entities/county.entity';
import { Property } from '../models/entities/property.entity';
import { Auction, AuctionStatus } from '../models/entities/auction.entity';
import { Certificate, CertificateStatus } from '../models/entities/certificate.entity';

export class InitialDataSeed {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async run(): Promise<void> {
    await this.seedUsers();
    await this.seedCounties();
    // Uncomment to seed more data
    // await this.seedPropertiesAndCertificates();
  }

  private async seedUsers(): Promise<void> {
    const userRepository = this.connection.getRepository(User);
    
    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already seeded, skipping...');
      return;
    }
    
    // Create admin user
    const adminUser = new User();
    adminUser.email = 'admin@example.com';
    adminUser.firstName = 'Admin';
    adminUser.lastName = 'User';
    adminUser.role = UserRole.ADMIN;
    adminUser.verifiedAt = new Date();
    
    // Create staff user
    const staffUser = new User();
    staffUser.email = 'staff@example.com';
    staffUser.firstName = 'Staff';
    staffUser.lastName = 'User';
    staffUser.role = UserRole.INVESTOR; // Use INVESTOR role for staff for now
    staffUser.verifiedAt = new Date();
    
    // Create investor user
    const investorUser = new User();
    investorUser.email = 'investor@example.com';
    investorUser.firstName = 'Investor';
    investorUser.lastName = 'User';
    investorUser.role = UserRole.INVESTOR; // Use INVESTOR role for investor for now
    investorUser.verifiedAt = new Date();
    
    // Save users
    await userRepository.save([adminUser, staffUser, investorUser]);
    console.log('Users seeded successfully');
  }

  private async seedCounties(): Promise<void> {
    const countyRepository = this.connection.getRepository(County);
    
    // Check if counties already exist
    const existingCounties = await countyRepository.count();
    if (existingCounties > 0) {
      console.log('Counties already seeded, skipping...');
      return;
    }
    
    // Florida counties data
    const countyData = [
      {
        name: 'Miami-Dade',
        state: 'Florida',
        countyCode: 'FL-13',
        websiteUrl: 'https://www.miamidade.gov',
        taxCollectorUrl: 'https://www.miamidade.gov/global/service.page?Mduid_service=ser1495746415127761',
        propertyAppraiserUrl: 'https://www.miamidade.gov/pa/',
        description: 'Miami-Dade County is a county located in the southeastern part of the U.S. state of Florida.',
        latitude: 25.5516,
        longitude: -80.6327
      },
      {
        name: 'Broward',
        state: 'Florida',
        countyCode: 'FL-06',
        websiteUrl: 'https://www.broward.org',
        taxCollectorUrl: 'https://broward.county-taxes.com/public',
        propertyAppraiserUrl: 'https://web.bcpa.net/',
        description: 'Broward County is a county located in the southeastern part of the U.S. state of Florida.',
        latitude: 26.1901,
        longitude: -80.3659
      },
      {
        name: 'Palm Beach',
        state: 'Florida',
        countyCode: 'FL-50',
        websiteUrl: 'https://discover.pbcgov.org',
        taxCollectorUrl: 'https://www.pbctax.com/',
        propertyAppraiserUrl: 'https://www.pbcgov.org/papa/',
        description: 'Palm Beach County is a county located in the southeastern part of the U.S. state of Florida.',
        latitude: 26.6515,
        longitude: -80.2767
      },
      {
        name: 'Hillsborough',
        state: 'Florida',
        countyCode: 'FL-29',
        websiteUrl: 'https://www.hillsboroughcounty.org',
        taxCollectorUrl: 'https://hillsborough.county-taxes.com/public',
        propertyAppraiserUrl: 'https://www.hcpafl.org/',
        description: 'Hillsborough County is a county located in the west central portion of the U.S. state of Florida.',
        latitude: 27.9904,
        longitude: -82.3018
      },
      {
        name: 'Orange',
        state: 'Florida',
        countyCode: 'FL-48',
        websiteUrl: 'https://www.orangecountyfl.net',
        taxCollectorUrl: 'https://www.octaxcol.com/',
        propertyAppraiserUrl: 'https://www.ocpafl.org/',
        description: 'Orange County is a county located in the central portion of the U.S. state of Florida.',
        latitude: 28.4845,
        longitude: -81.2518
      }
    ];
    
    // Create county entities
    const counties = countyData.map(data => {
      const county = new County();
      Object.assign(county, data);
      return county;
    });
    
    // Save counties
    await countyRepository.save(counties);
    console.log('Counties seeded successfully');
  }

  private async seedPropertiesAndCertificates(): Promise<void> {
    // This can be implemented to seed properties, auctions, and certificates
    // For a larger application, we recommend separating this into different methods
    console.log('Property and certificate seeding not implemented yet');
  }
}

// Function to execute seeds
export async function seed(connection: Connection): Promise<void> {
  const seeder = new InitialDataSeed(connection);
  await seeder.run();
} 