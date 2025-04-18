import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionController } from '../controllers/auction.controller';
import { AuctionService } from '../services/auction.service';
import { Auction } from '../models/entities/auction.entity';
import { County } from '../models/entities/county.entity';
import { Certificate } from '../models/entities/certificate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, County, Certificate])],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
