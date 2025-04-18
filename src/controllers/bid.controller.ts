import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BidService } from '../services/bid.service';
import { CreateBidDto } from '../dtos/create-bid.dto';
import { UpdateBidDto } from '../dtos/update-bid.dto';
import { Bid } from '../models/entities/bid.entity';

@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get()
  async findAll(): Promise<Bid[]> {
    return this.bidService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Bid | null> {
    return this.bidService.findById(id);
  }

  @Get('auction/:auctionId')
  async findByAuction(@Param('auctionId', new ParseUUIDPipe()) auctionId: string): Promise<Bid[]> {
    return this.bidService.findByAuction(auctionId);
  }

  @Get('certificate/:certificateId')
  async findByCertificate(
    @Param('certificateId', new ParseUUIDPipe()) certificateId: string
  ): Promise<Bid[]> {
    return this.bidService.findByCertificate(certificateId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', new ParseUUIDPipe()) userId: string): Promise<Bid[]> {
    return this.bidService.findByUser(userId);
  }

  @Post()
  async create(@Body() createBidDto: CreateBidDto): Promise<Bid> {
    return this.bidService.create(createBidDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateBidDto: UpdateBidDto
  ): Promise<Bid | null> {
    return this.bidService.update(id, updateBidDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.bidService.delete(id);
  }
}
