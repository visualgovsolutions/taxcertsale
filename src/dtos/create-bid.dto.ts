import { IsUUID, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateBidDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  certificateId!: string;

  @IsUUID()
  auctionId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsNumber()
  @Min(0)
  @Max(18)
  interestRate!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
