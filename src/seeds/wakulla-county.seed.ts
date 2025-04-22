import prisma from '../lib/prisma';

/**
 * Seed script to add Wakulla County, Florida
 */
export async function seedWakullaCounty() {
  try {
    // Check if Wakulla County already exists
    const existingCounty = await prisma.county.findUnique({
      where: { name: 'Wakulla' }
    });
    
    if (existingCounty) {
      console.log('Wakulla County already exists, skipping...');
      return existingCounty;
    }
    
    // Create Wakulla County
    const wakullaCounty = await prisma.county.create({
      data: {
        name: 'Wakulla',
        state: 'Florida',
        countyCode: 'FL-65',
        websiteUrl: 'https://www.mywakulla.com',
        taxCollectorUrl: 'https://wakulla.county-taxes.com/public',
        propertyAppraiserUrl: 'https://www.wakullapa.com/',
        description: 'Wakulla County is a county located in the Florida Panhandle in the northwestern part of the U.S. state of Florida. It is known for its natural springs, wildlife, and the St. Marks National Wildlife Refuge.',
        latitude: 30.0977,
        longitude: -84.3866
      }
    });
    
    console.log('Wakulla County created successfully:', wakullaCounty);
    return wakullaCounty;
  } catch (error) {
    console.error('Error seeding Wakulla County:', error);
    throw error;
  }
}

// Run the seed if this script is executed directly
if (require.main === module) {
  seedWakullaCounty()
    .then(() => {
      console.log('Wakulla County seed complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Wakulla County seed failed:', error);
      process.exit(1);
    });
} 