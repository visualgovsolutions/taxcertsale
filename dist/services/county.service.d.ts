import { County } from '../models/entities';
export declare class CountyService {
    findAll(): Promise<County[]>;
    findById(id: string): Promise<County | null>;
    findByName(name: string): Promise<County | null>;
    findByState(state: string): Promise<County[]>;
    create(countyData: Partial<County>): Promise<County>;
    update(id: string, countyData: Partial<County>): Promise<County | null>;
    delete(id: string): Promise<boolean>;
    findWithProperties(id: string): Promise<County | null>;
    findWithCertificates(id: string): Promise<County | null>;
    findWithAuctions(id: string): Promise<County | null>;
}
export declare const countyService: CountyService;
export default countyService;
