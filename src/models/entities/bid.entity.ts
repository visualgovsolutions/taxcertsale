import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Certificate } from './certificate.entity';
import { Auction } from './auction.entity';

export enum BidStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, user => user.bids)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => Certificate, certificate => certificate.bids)
  @JoinColumn({ name: 'certificate_id' })
  certificate!: Certificate;

  @Column({ name: 'certificate_id' })
  certificateId!: string;

  @ManyToOne(() => Auction, auction => auction.bids)
  @JoinColumn({ name: 'auction_id' })
  auction!: Auction;

  @Column({ name: 'auction_id' })
  auctionId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  interestRate!: number;

  @Column({
    type: 'enum',
    enum: BidStatus,
    default: BidStatus.PENDING,
  })
  status!: BidStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
