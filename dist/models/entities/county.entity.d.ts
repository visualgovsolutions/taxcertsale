import { Auction } from './auction.entity';
import { Property } from './property.entity';
import { Certificate } from './certificate.entity';
export declare class County {
    id: string;
    name: string;
    state: string;
    countyCode?: string;
    websiteUrl?: string;
    taxCollectorUrl?: string;
    propertyAppraiserUrl?: string;
    description?: string;
    metadata?: Record<string, any>;
    latitude?: number;
    longitude?: number;
    properties: Property[];
    certificates: Certificate[];
    auctions: Auction[];
    createdAt: Date;
    updatedAt: Date;
}
