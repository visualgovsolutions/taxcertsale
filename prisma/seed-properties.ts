import { PrismaClient } from '../src/generated/prisma';
import { v4 as uuidv4 } from 'uuid';

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed property data...');

  try {
    // First get all certificates
    const certificates = await prisma.certificate.findMany({
      include: {
        county: true
      }
    });

    // Filter for certificates that need properties
    const certificatesWithoutProperty = [];
    for (const cert of certificates) {
      try {
        // Check if property exists
        const property = await prisma.property.findUnique({
          where: {
            id: cert.propertyId
          }
        });

        if (!property) {
          certificatesWithoutProperty.push(cert);
        }
      } catch (error) {
        console.log(`Error checking property for certificate ${cert.id}:`, error);
        certificatesWithoutProperty.push(cert);
      }
    }

    console.log(`Found ${certificatesWithoutProperty.length} certificates without properties`);

    // Create properties for each certificate
    for (const certificate of certificatesWithoutProperty) {
      // Generate random address details
      const streetNumbers = ['123', '456', '789', '1010', '2020', '3030', '4040', '5050'];
      const streetNames = ['Main St', 'Oak Ave', 'Pine Dr', 'Maple Ln', 'Cedar Rd', 'Elm Blvd', 'Sunset Way', 'Beach Rd'];
      const cities = ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'Fort Lauderdale', 'St. Petersburg', 'Tallahassee'];
      const zipCodes = ['32099', '33101', '33602', '32801', '33301', '33701', '32301'];
      
      const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const zipCode = zipCodes[Math.floor(Math.random() * zipCodes.length)];
      
      // Generate a parcel ID if none exists
      const parcelId = `P-${Math.floor(Math.random() * 10000)}`;
      
      // Create property
      const property = await prisma.property.create({
        data: {
          id: uuidv4(),
          parcelId: parcelId,
          address: `${streetNumber} ${streetName}`,
          city: city,
          state: 'FL',
          zipCode: zipCode,
          legalDescription: `Legal description for parcel ${parcelId}`,
          countyId: certificate.countyId,
        }
      });
      
      // Update certificate with propertyId
      await prisma.certificate.update({
        where: {
          id: certificate.id
        },
        data: {
          propertyId: property.id
        }
      });

      console.log(`Created property for certificate ${certificate.id}`);
    }

    console.log('Finished seeding property data');
  } catch (error) {
    console.error('Error seeding property data:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 