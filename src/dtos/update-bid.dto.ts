import { IsOptional, IsNumber, IsString, Min, Max, IsEnum } from 'class-validator';
import { BidStatus } from '../models/entities/bid.entity';

export class UpdateBidDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(18)
  interestRate?: number;

  @IsOptional()
  @IsEnum(BidStatus)
  status?: BidStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
