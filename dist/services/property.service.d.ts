import { Property } from '../models/entities';
export declare class PropertyService {
    findAll(): Promise<Property[]>;
    findById(id: string): Promise<Property | null>;
    findByParcelId(parcelId: string): Promise<Property | null>;
    findByCounty(countyId: string): Promise<Property[]>;
    findByAddress(address: string): Promise<Property[]>;
    findByOwner(ownerName: string): Promise<Property[]>;
    create(propertyData: Partial<Property>): Promise<Property>;
    update(id: string, propertyData: Partial<Property>): Promise<Property | null>;
    delete(id: string): Promise<boolean>;
    findWithCertificates(id: string): Promise<Property | null>;
    findWithCounty(id: string): Promise<Property | null>;
    findWithRelations(id: string): Promise<Property | null>;
    searchProperties(searchParams: {
        countyId?: string;
        address?: string;
        parcelId?: string;
        ownerName?: string;
        propertyType?: string;
        zoning?: string;
        minLandArea?: number;
        maxLandArea?: number;
        minBuildingArea?: number;
        maxBuildingArea?: number;
    }): Promise<Property[]>;
}
export declare const propertyService: PropertyService;
export default propertyService;
