import prisma from '../../src/lib/prisma';
import { hashPassword } from '../../src/backend/utils/passwordUtils';

/**
 * Seed script to create example users including an admin user
 */
export async function seedUsers() {
  console.log('Seeding users...');

  // Check if admin user exists first
  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [{ email: 'admin@example.com' }, { username: 'admin' }],
    },
  });

  // Create admin user if not exists
  let adminUser;
  if (!existingAdmin) {
    adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: await hashPassword('Password123!'),
        role: 'admin',
        status: 'ACTIVE',
      },
    });
    console.log(`Created admin user: ${adminUser.username} (${adminUser.id})`);
  } else {
    adminUser = existingAdmin;
    console.log(`Admin user already exists: ${adminUser.username} (${adminUser.id})`);
  }

  // Create other users
  const usersToCreate = [
    {
      username: 'county_official',
      email: 'county@example.com',
      password: await hashPassword('Password123!'),
      role: 'county_official',
      status: 'ACTIVE',
    },
    {
      username: 'investor',
      email: 'investor@example.com',
      password: await hashPassword('Password123!'),
      role: 'investor',
      status: 'ACTIVE',
    },
    {
      username: 'user',
      email: 'user@example.com',
      password: await hashPassword('Password123!'),
      role: 'user',
      status: 'ACTIVE',
    },
  ];

  let createdCount = 0;
  for (const userData of usersToCreate) {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: userData.email }, { username: userData.username }],
      },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: userData,
      });
      createdCount++;
    } else {
      console.log(`User ${userData.username} already exists`);
    }
  }

  console.log(`Created ${createdCount} additional users`);
  return adminUser;
}

// Run directly if called directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('User seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding users:', error);
      process.exit(1);
    });
}
