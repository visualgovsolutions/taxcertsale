import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { County } from './county.entity';
import { Property } from './property.entity';
import { Auction } from './auction.entity';
import { Bid } from './bid.entity';

export enum CertificateStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired'
}

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  certificateNumber!: string;

  @ManyToOne(() => Auction, auction => auction.certificates)
  @JoinColumn({ name: 'auction_id' })
  auction!: Auction;

  @Column({ name: 'auction_id' })
  auctionId!: string;

  @ManyToOne(() => Property, property => property.certificates)
  @JoinColumn({ name: 'property_id' })
  property!: Property;

  @Column({ name: 'property_id' })
  propertyId!: string;

  @ManyToOne(() => County, county => county.certificates)
  @JoinColumn({ name: 'county_id' })
  county!: County;

  @Column({ name: 'county_id' })
  countyId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  faceValue!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  interestRate!: number;

  @Column({ type: 'date' })
  issueDate!: Date;

  @Column({ 
    type: 'enum', 
    enum: CertificateStatus, 
    default: CertificateStatus.AVAILABLE 
  })
  status!: CertificateStatus;

  @Column({ type: 'date', nullable: true })
  soldDate?: Date;

  @Column({ type: 'date', nullable: true })
  redeemedDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  redemptionAmount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  earningsAmount?: number;

  @Column({ nullable: true })
  holderId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => Bid, bid => bid.certificate)
  bids!: Bid[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
