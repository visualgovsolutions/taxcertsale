// IMPORTANT: Always import directly from the entity file, not from the barrel/index file, to avoid circular dependency issues with TypeORM.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  Check,
  getRepository,
} from 'typeorm';
import { User } from './user.entity';
import { Certificate } from './certificate.entity';
import { Auction } from './auction.entity';

export enum BidStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

const VALID_STATUS_TRANSITIONS: Record<BidStatus, BidStatus[]> = {
  [BidStatus.PENDING]: [BidStatus.ACTIVE, BidStatus.CANCELLED],
  [BidStatus.ACTIVE]: [
    BidStatus.ACCEPTED,
    BidStatus.REJECTED,
    BidStatus.CANCELLED,
    BidStatus.EXPIRED,
  ],
  [BidStatus.ACCEPTED]: [BidStatus.CANCELLED],
  [BidStatus.REJECTED]: [],
  [BidStatus.CANCELLED]: [],
  [BidStatus.EXPIRED]: [],
};

@Entity('bids')
@Check('"bidPercentage" = 0 OR "bidPercentage" >= 5')
@Check('"bidPercentage" <= 18')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  certificateId!: string;

  @ManyToOne(() => Certificate)
  @JoinColumn({ name: 'certificateId' })
  certificate!: Certificate;

  @Column()
  auctionId!: string;

  @ManyToOne(() => Auction)
  @JoinColumn({ name: 'auctionId' })
  auction!: Auction;

  @Column('decimal', { precision: 5, scale: 2 })
  @Check('bidPercentage >= 0 AND bidPercentage <= 18')
  @Check('bidPercentage = 0 OR bidPercentage >= 5')
  bidPercentage: number;

  @Column({
    type: 'enum',
    enum: BidStatus,
    default: BidStatus.PENDING,
  })
  status: BidStatus;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async validateBid() {
    // Validate status transition
    const repo = getRepository(Bid);
    if (this.id) {
      const existingBid = await repo.findOne({ where: { id: this.id } });
      if (existingBid && existingBid.status !== this.status) {
        const validTransitions = VALID_STATUS_TRANSITIONS[existingBid.status];
        if (!validTransitions.includes(this.status)) {
          throw new Error(`Invalid status transition from ${existingBid.status} to ${this.status}`);
        }
      }
    }

    // Validate bid percentage precision
    const bidStr = this.bidPercentage.toString();
    const decimalPlaces = bidStr.includes('.') ? bidStr.split('.')[1].length : 0;
    if (decimalPlaces > 2) {
      throw new Error('Bid percentage cannot have more than 2 decimal places');
    }

    // Validate new bid is lower than existing bids
    if (this.status === BidStatus.PENDING || this.status === BidStatus.ACTIVE) {
      const existingBids = await repo.find({
        where: {
          certificateId: this.certificateId,
          status: BidStatus.ACTIVE,
        },
      });

      for (const existingBid of existingBids) {
        if (existingBid.id !== this.id && existingBid.bidPercentage <= this.bidPercentage) {
          throw new Error('New bid must be lower than existing bids');
        }
      }
    }
  }
}
