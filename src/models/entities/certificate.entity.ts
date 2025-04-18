import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from './property.entity';
import { Auction } from './auction.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  certificateNumber: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  faceValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  interestRate: number;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  holderName: string;

  @Column({ type: 'date', nullable: true })
  redemptionDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  redemptionAmount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Property, property => property.certificates)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ type: 'uuid' })
  propertyId: string;

  @ManyToOne(() => Auction, auction => auction.certificates)
  @JoinColumn({ name: 'auctionId' })
  auction: Auction;

  @Column({ type: 'uuid' })
  auctionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
