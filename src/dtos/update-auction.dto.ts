import { IsOptional, IsDate, IsString, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AuctionStatus } from './create-auction.dto';

export class UpdateAuctionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  auctionDate?: Date;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  registrationUrl?: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsUUID()
  countyId?: string;
}
