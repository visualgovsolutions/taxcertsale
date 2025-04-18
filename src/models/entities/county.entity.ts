// IMPORTANT: Always import directly from the entity file, not from the barrel/index file, to avoid circular dependency issues with TypeORM.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
// import { Auction } from './auction.entity';
import { Property } from './property.entity';
import { Certificate } from './certificate.entity';

@Entity('counties')
export class County {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  state!: string;

  @Column({ nullable: true })
  countyCode?: string;

  @Column({ nullable: true })
  websiteUrl?: string;

  @Column({ nullable: true })
  taxCollectorUrl?: string;

  @Column({ nullable: true })
  propertyAppraiserUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude?: number;

  @OneToMany(() => Property, property => property.county)
  properties!: Property[];

  @OneToMany(() => Certificate, certificate => certificate.county)
  certificates!: Certificate[];

  @OneToMany('Auction', 'county')
  auctions!: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
