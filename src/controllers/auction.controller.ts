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
} from '@nestjs/common';
import { AuctionService } from '../services/auction.service';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { UpdateAuctionDto } from '../dtos/update-auction.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../models/enums/role.enum';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  findAll() {
    return this.auctionService.findAll();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.auctionService.findUpcoming();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.auctionService.search(searchTerm);
  }

  @Get('county/:id')
  findByCounty(@Param('id') id: string) {
    return this.auctionService.findByCounty(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Get(':id/certificates')
  findWithCertificates(@Param('id') id: string) {
    return this.auctionService.findWithCertificates(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.create(createAuctionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionService.update(id, updateAuctionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.auctionService.remove(id);
  }
}
