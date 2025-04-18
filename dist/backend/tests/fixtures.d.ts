/**
 * Test fixtures for use across tests
 *
 * This file contains sample data and helper functions for testing
 */
export declare const testUsers: {
    admin: {
        email: string;
        password: string;
        role: string;
        firstName: string;
        lastName: string;
    };
    regularUser: {
        email: string;
        password: string;
        role: string;
        firstName: string;
        lastName: string;
    };
    investor: {
        email: string;
        password: string;
        role: string;
        firstName: string;
        lastName: string;
    };
};
export declare const testProperties: {
    parcelId: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    taxAmount: number;
    certificateId: string;
}[];
export declare const testCertificates: {
    certificateId: string;
    parcelId: string;
    faceValue: number;
    interestRate: number;
    issueDate: Date;
    status: string;
}[];
export declare const generateTestToken: (user: any) => string;
export declare const seedTestData: () => Promise<{
    users: {
        admin: {
            email: string;
            password: string;
            role: string;
            firstName: string;
            lastName: string;
        };
        regularUser: {
            email: string;
            password: string;
            role: string;
            firstName: string;
            lastName: string;
        };
        investor: {
            email: string;
            password: string;
            role: string;
            firstName: string;
            lastName: string;
        };
    };
    properties: {
        parcelId: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
        };
        taxAmount: number;
        certificateId: string;
    }[];
    certificates: {
        certificateId: string;
        parcelId: string;
        faceValue: number;
        interestRate: number;
        issueDate: Date;
        status: string;
    }[];
}>;
