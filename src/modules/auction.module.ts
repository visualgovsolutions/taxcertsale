import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionController } from '../controllers/auction.controller';
import { AuctionService } from '../services/auction.service';
import { AuctionRepository } from '../repositories/auction.repository';
import { Auction } from '../models/entities/auction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, AuctionRepository])],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
