import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Auction } from './auction.entity';
import { Property } from './property.entity';
import { Certificate } from './certificate.entity';

@Entity('counties')
export class County {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 10 })
  code!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website!: string;

  @Column({ type: 'text', nullable: true })
  contactInformation!: string;

  @Column({ nullable: true, type: 'jsonb' })
  metadata!: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @OneToMany(() => Auction, auction => auction.county)
  auctions!: Auction[];

  @OneToMany(() => Property, property => property.county)
  properties!: Property[];

  @OneToMany(() => Certificate, certificate => certificate.county)
  certificates!: Certificate[];
}
