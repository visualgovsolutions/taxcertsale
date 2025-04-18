import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuctionService } from '../services/auction.service';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { UpdateAuctionDto } from '../dtos/update-auction.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../models/enums/role.enum';
import { Auction } from '../models/entities/auction.entity';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  async findAll(@Query('county') countyId?: string): Promise<Auction[]> {
    if (countyId) {
      return this.auctionService.findByCounty(countyId);
    }
    return this.auctionService.findAll();
  }

  @Get('upcoming')
  async findUpcoming(): Promise<Auction[]> {
    return this.auctionService.findUpcoming();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.auctionService.search(searchTerm);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Auction> {
    return this.auctionService.findOne(id);
  }

  @Get(':id/certificates')
  findWithCertificates(@Param('id') id: string) {
    return this.auctionService.findWithCertificates(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() auctionData: Partial<Auction>): Promise<Auction> {
    return this.auctionService.create(auctionData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() auctionData: Partial<Auction>
  ): Promise<Auction> {
    return this.auctionService.update(id, auctionData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.auctionService.remove(id);
  }

  @Post(':id/start')
  async startAuction(@Param('id', new ParseUUIDPipe()) id: string): Promise<Auction> {
    return this.auctionService.startAuction(id);
  }

  @Post(':id/end')
  async endAuction(@Param('id', new ParseUUIDPipe()) id: string): Promise<Auction> {
    return this.auctionService.endAuction(id);
  }

  @Post(':id/cancel')
  async cancelAuction(@Param('id', new ParseUUIDPipe()) id: string): Promise<Auction> {
    return this.auctionService.cancelAuction(id);
  }
}
