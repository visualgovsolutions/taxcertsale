import { County } from './county.entity';
import { Certificate } from './certificate.entity';
export declare class Property {
    id: string;
    parcelId: string;
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    assessedValue?: number;
    marketValue?: number;
    latitude?: number;
    longitude?: number;
    propertyType?: string;
    zoning?: string;
    landArea?: number;
    buildingArea?: number;
    yearBuilt?: number;
    ownerName?: string;
    description?: string;
    metadata?: Record<string, any>;
    countyId: string;
    county: County;
    certificates: Certificate[];
    createdAt: Date;
    updatedAt: Date;
}
