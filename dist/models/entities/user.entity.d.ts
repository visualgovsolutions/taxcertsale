import { Bid } from './bid.entity';
export declare enum UserRole {
    ADMIN = "admin",
    INVESTOR = "investor",
    COUNTY_OFFICIAL = "county_official",
    VIEWER = "viewer"
}
export declare enum AccountStatus {
    ACTIVE = "active",
    PENDING = "pending",
    SUSPENDED = "suspended",
    INACTIVE = "inactive"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: AccountStatus;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    companyName?: string;
    preferences?: Record<string, any>;
    notifications?: Record<string, any>;
    metadata?: Record<string, any>;
    lastLoginAt?: Date;
    verifiedAt?: Date;
    bids: Bid[];
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
}
