import { AuctionStatus } from '../models/entities/auction.entity';

export class CreateAuctionDto {
  name!: string;

  auctionDate!: Date;

  startTime!: string;

  endTime!: string;

  status!: AuctionStatus;

  description?: string;

  location?: string;

  registrationUrl?: string;

  metadata?: Record<string, any>;

  countyId!: string;
}
