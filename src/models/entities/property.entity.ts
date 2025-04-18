// IMPORTANT: Always import directly from the entity file, not from the barrel/index file, to avoid circular dependency issues with TypeORM.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { County } from './county.entity';
import { Certificate } from './certificate.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  parcelId!: string;

  @Column()
  address!: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  assessedValue?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  marketValue?: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude?: number;

  @Column({ type: 'varchar', nullable: true })
  propertyType?: string;

  @Column({ type: 'varchar', nullable: true })
  zoning?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  landArea?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  buildingArea?: number;

  @Column({ type: 'int', nullable: true })
  yearBuilt?: number;

  @Column({ type: 'varchar', nullable: true })
  ownerName?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: false })
  countyId!: string;

  @ManyToOne(() => County, county => county.properties)
  @JoinColumn({ name: 'county_id' })
  county!: County;

  @OneToMany(() => Certificate, certificate => certificate.property)
  certificates!: Certificate[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
