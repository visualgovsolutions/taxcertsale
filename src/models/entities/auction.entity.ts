// IMPORTANT: Always import directly from the entity file, not from the barrel/index file, to avoid circular dependency issues with TypeORM.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Certificate } from './certificate.entity';
// import { County } from './county.entity';
import { Bid } from './bid.entity';

export enum AuctionStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ name: 'auction_date', type: 'date' })
  auctionDate!: Date;

  @Column({ name: 'start_time', type: 'time' })
  startTime!: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime!: string;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.UPCOMING,
  })
  status!: AuctionStatus;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'text', nullable: true })
  location!: string;

  @Column({ name: 'registration_url', type: 'text', nullable: true })
  registrationUrl!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'county_id' })
  countyId!: string;

  @ManyToOne('County', 'auctions')
  @JoinColumn({ name: 'county_id' })
  county!: any; // Use any to avoid type issues with string-based relations

  @OneToMany(() => Certificate, certificate => certificate.auction)
  certificates!: Certificate[];

  @OneToMany(() => Bid, bid => bid.auction)
  bids!: Bid[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
