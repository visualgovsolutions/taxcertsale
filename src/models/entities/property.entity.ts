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

  @Column({ length: 100 })
  parcelId!: string;

  @Column({ type: 'text' })
  address!: string;

  @Column({ type: 'text' })
  city!: string;

  @Column({ type: 'text', length: 2 })
  state!: string;

  @Column({ type: 'text', length: 10 })
  zipCode!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  assessedValue!: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  marketValue!: number;

  @Column({ nullable: true, type: 'text' })
  ownerName!: string;

  @Column({ nullable: true, type: 'jsonb' })
  coordinates!: { latitude: number; longitude: number };

  @Column({ nullable: true, type: 'jsonb' })
  metadata!: Record<string, any>;

  @Column({ type: 'uuid' })
  countyId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => County, county => county.properties)
  @JoinColumn({ name: 'countyId' })
  county!: County;

  @OneToMany(() => Certificate, certificate => certificate.property)
  certificates!: Certificate[];
}
