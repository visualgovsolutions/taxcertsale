import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { County } from './county.entity';
import { Property } from './property.entity';
import { Auction } from './auction.entity';
import { User } from './user.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100, unique: true })
  certificateNumber!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  faceValue!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  interestRate: number;

  @Column({ type: 'date', nullable: true })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ type: 'date', nullable: true })
  redemptionDate: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'redeemed', 'expired', 'cancelled'],
    default: 'active',
  })
  status!: 'active' | 'redeemed' | 'expired' | 'cancelled';

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => County, county => county.certificates)
  @JoinColumn({ name: 'county_id' })
  county: County;

  @Column({ name: 'county_id' })
  countyId: string;

  @ManyToOne(() => Property, property => property.certificates)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'property_id' })
  propertyId: string;

  @ManyToOne(() => Auction, auction => auction.certificates)
  @JoinColumn({ name: 'auction_id' })
  auction: Auction;

  @Column({ name: 'auction_id', nullable: true })
  auctionId: string;

  @ManyToOne(() => User, user => user.certificates, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id', nullable: true })
  ownerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
