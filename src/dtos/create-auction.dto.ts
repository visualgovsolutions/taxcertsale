import { IsNotEmpty, IsDate, IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum AuctionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateAuctionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  auctionDate: Date;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsEnum(AuctionStatus)
  status: AuctionStatus;

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

  @IsNotEmpty()
  @IsUUID()
  countyId: string;
}
