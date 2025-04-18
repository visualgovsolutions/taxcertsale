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
import { County } from './county.entity';

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

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'date' })
  auctionDate!: Date;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time', nullable: true })
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

  @Column({ type: 'text', nullable: true })
  registrationUrl!: string;

  @Column({ nullable: true, type: 'jsonb' })
  metadata!: Record<string, any>;

  @Column({ type: 'uuid' })
  countyId!: string;

  @ManyToOne(() => County, county => county.auctions)
  @JoinColumn({ name: 'countyId' })
  county!: County;

  @OneToMany(() => Certificate, certificate => certificate.auction)
  certificates!: Certificate[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
