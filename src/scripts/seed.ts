import prisma from '../lib/prisma';
import { hashPassword } from '../backend/utils/passwordUtils';

async function main() {
  const users = [
    { email: 'admin@visualgov.com', username: 'admin', role: 'ADMIN', password: 'AdminPass1!' },
    { email: 'bidder01@visualgov.com', username: 'bidder01', role: 'INVESTOR', password: 'BidderPass1!' },
    { email: 'county@visualgov.com', username: 'county', role: 'COUNTY_OFFICIAL', password: 'CountyPass1!' },
  ];

  for (const u of users) {
    const hashed = await hashPassword(u.password);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        username: u.username,
        role: u.role as any,
        password: hashed,
      },
    });
    console.log(`Seeded user ${u.email}`);
  }
}

main().then(() => {
  console.log('Seed complete');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
}); 