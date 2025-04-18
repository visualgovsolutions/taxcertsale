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
  id: string;

  @Column({ type: 'varchar', length: 100 })
  parcelId: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zipCode: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  latitude: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  longitude: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  propertyType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ownerName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  assessedValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  marketValue: number;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => County, county => county.properties)
  @JoinColumn({ name: 'countyId' })
  county: County;

  @Column({ type: 'uuid' })
  countyId: string;

  @OneToMany(() => Certificate, certificate => certificate.property)
  certificates: Certificate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
