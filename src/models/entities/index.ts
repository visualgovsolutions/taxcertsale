import { User } from './user.entity';
import { County } from './county.entity';
import { Property } from './property.entity';
import { Certificate } from './certificate.entity';
import { Auction } from './auction.entity';
import { Bid } from './bid.entity';

// Only export the entities array and individual classes, not destructured re-exports
export const entities = [
  User,
  County,
  Property,
  Certificate,
  Auction,
  Bid
];

export { User, County, Property, Certificate, Auction, Bid };
