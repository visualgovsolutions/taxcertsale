import { User } from './user.entity';
import { County } from './county.entity';
import { Property } from './property.entity';
import { Certificate } from './certificate.entity';
import { Auction } from './auction.entity';
import { Bid } from './bid.entity';

// Export all entities
export { User } from './user.entity';
export { County } from './county.entity';
export { Property } from './property.entity';
export { Certificate } from './certificate.entity';
export { Auction } from './auction.entity';
export { Bid } from './bid.entity';

// Add entities to this array for TypeORM connection
export const entities = [
  User,
  County,
  Property,
  Certificate,
  Auction,
  Bid
];
