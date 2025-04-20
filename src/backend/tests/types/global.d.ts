import { Repository } from 'typeorm';
import { User } from '../../../models/entities/user.entity';
import { County } from '../../../models/entities/county.entity';
import { Auction } from '../../../models/entities/auction.entity';
import { Property } from '../../../models/entities/property.entity';
import { Certificate } from '../../../models/entities/certificate.entity';
import { Bid } from '../../../models/entities/bid.entity';

declare global {
  namespace NodeJS {
    interface Global {
      testRepos: {
        userRepo: Repository<User>;
        countyRepo: Repository<County>;
        auctionRepo: Repository<Auction>;
        propertyRepo: Repository<Property>;
        certificateRepo: Repository<Certificate>;
        bidRepo: Repository<Bid>;
      };
    }
  }
} 