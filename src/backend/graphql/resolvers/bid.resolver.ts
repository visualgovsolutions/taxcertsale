import { GraphQLError } from 'graphql';
import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

// Mock repositories (would be implemented in a real app)
const bidRepository = {
  findByUserId: async (userId: string) => {
    // Mock implementation
    return [];
  },
  create: async (data: any) => {
    // Mock implementation
    return {
      id: 'mock-id',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

const certificateRepository = {
  findById: async (id: string) => {
    // Mock implementation
    return null;
  },
  findByCertificateNumber: async (number: string) => {
    // Mock implementation
    return null;
  }
};

const userRepository = {
  findById: async (id: string) => {
    // Mock implementation
    return null;
  }
};

const auctionRepository = {
  findByCertificateId: async (id: string) => {
    // Mock implementation
    return null;
  }
};

// Simple CSV parser implementation
const parseCsv = (content: string, options: any) => {
  // Simple implementation - would use real csv-parse in production
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).filter(line => line.trim().length > 0).map(line => {
    const values = line.split(',').map(v => v.trim());
    const record: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    return record;
  });
};

// Simple XLSX parser mock
const parseXlsx = (buffer: Buffer) => {
  // In a real implementation, we would use the xlsx library
  // This is just a mock
  return [];
};

export const bidResolvers = {
  Query: {
    myBids: async (_: any, __: any, { user, prisma }: { user: any, prisma: PrismaClient }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to view your bids');
      }

      try {
        const bids = await bidRepository.findByUserId(user.id);
        return bids;
      } catch (error: any) {
        logger.error('Error fetching bids', { error, userId: user.id });
        throw new ApolloError('Failed to fetch bids');
      }
    }
  },
  Mutation: {
    createBid: async (_: any, { certificateId, interestRate }: { certificateId: string, interestRate: number }, { user, prisma }: { user: any, prisma: PrismaClient }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to place a bid');
      }

      try {
        // Validate certificate exists and is available for bidding
        const certificate = await certificateRepository.findById(certificateId);
        if (!certificate) {
          throw new GraphQLError('Certificate not found');
        }

        // Check if certificate is part of an active auction
        const auction = await auctionRepository.findByCertificateId(certificateId);
        if (!auction || auction.status !== 'ACTIVE') {
          throw new GraphQLError('This certificate is not available for bidding');
        }

        // Check if interest rate is valid
        if (interestRate < 0 || interestRate > auction.maxInterestRate) {
          throw new GraphQLError(`Interest rate must be between 0 and ${auction.maxInterestRate}%`);
        }

        // Create the bid
        const bid = await bidRepository.create({
          certificateId,
          userId: user.id,
          interestRate,
          status: 'PENDING',
        });

        return bid;
      } catch (error: any) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        logger.error('Error creating bid', { error, certificateId, userId: user.id });
        throw new ApolloError('Failed to create bid');
      }
    },
    
    uploadBids: async (_: any, { file }: { file: any }, { user, prisma }: { user: any, prisma: PrismaClient }) => {
      // Authentication check
      if (!user) {
        throw new AuthenticationError('You must be logged in to upload bids');
      }
      
      if (user.role !== 'INVESTOR') {
        throw new ForbiddenError('Only investors can upload bids');
      }

      try {
        // Process the uploaded file
        const { filename, createReadStream, mimetype } = await file;
        
        // Set up error tracking
        const errors: Array<{line: number, message: string}> = [];
        const processedBids: any[] = [];
        
        // Different parsing based on file type
        if (mimetype === 'text/csv' || filename.endsWith('.csv')) {
          // Process CSV file
          const stream = createReadStream();
          const buffers: Buffer[] = [];
          
          for await (const chunk of stream) {
            buffers.push(chunk as Buffer);
          }
          
          const buffer = Buffer.concat(buffers);
          const content = buffer.toString();
          
          // Parse CSV (using our simple implementation)
          const records = parseCsv(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true
          });
          
          // Process each record
          await Promise.all(records.map(async (record: any, index: number) => {
            try {
              const lineNumber = index + 2; // +2 because index starts at 0 and we skip the header line
              
              // Validate required fields
              if (!record.certificateNumber) {
                errors.push({ line: lineNumber, message: 'Certificate number is required' });
                return;
              }
              
              if (!record.interestRate || isNaN(parseFloat(record.interestRate))) {
                errors.push({ line: lineNumber, message: 'Valid interest rate is required' });
                return;
              }
              
              const interestRate = parseFloat(record.interestRate);
              
              // Find certificate by certificate number
              const certificate = await certificateRepository.findByCertificateNumber(record.certificateNumber);
              
              if (!certificate) {
                errors.push({ line: lineNumber, message: `Certificate ${record.certificateNumber} not found` });
                return;
              }
              
              // Check if certificate is part of an active auction
              const auction = await auctionRepository.findByCertificateId(certificate.id);
              if (!auction || auction.status !== 'ACTIVE') {
                errors.push({ 
                  line: lineNumber, 
                  message: `Certificate ${record.certificateNumber} is not available for bidding` 
                });
                return;
              }
              
              // Check if interest rate is valid
              if (interestRate < 0 || interestRate > auction.maxInterestRate) {
                errors.push({ 
                  line: lineNumber, 
                  message: `Interest rate must be between 0 and ${auction.maxInterestRate}%` 
                });
                return;
              }
              
              // Create the bid
              const bid = await bidRepository.create({
                certificateId: certificate.id,
                userId: user.id,
                interestRate,
                status: 'PENDING',
                notes: record.notes || null
              });
              
              processedBids.push(bid);
            } catch (error: any) {
              errors.push({ 
                line: index + 2, 
                message: `Error processing bid: ${error.message}` 
              });
            }
          }));
          
        } else if (mimetype.includes('spreadsheetml') || 
                  filename.endsWith('.xlsx') || 
                  filename.endsWith('.xls')) {
          // Process Excel file
          const stream = createReadStream();
          const buffers: Buffer[] = [];
          
          for await (const chunk of stream) {
            buffers.push(chunk as Buffer);
          }
          
          const buffer = Buffer.concat(buffers);
          
          // Parse Excel (using our mock implementation)
          const records = parseXlsx(buffer);
          
          // Process each record - similar to CSV processing
          // In a real implementation, we would process Excel files here
          
        } else {
          throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
        }
        
        // Return the result
        return {
          success: errors.length === 0,
          message: errors.length === 0 
            ? `Successfully processed ${processedBids.length} bids` 
            : `Processed with ${errors.length} errors`,
          processedCount: processedBids.length,
          errorCount: errors.length,
          errors: errors.length > 0 ? errors : null
        };
        
      } catch (error: any) {
        logger.error('Error uploading bids', { error, userId: user.id });
        throw new ApolloError(`Failed to upload bids: ${error.message}`);
      }
    }
  },
  Bid: {
    // Field resolvers for Bid type
    certificate: async (parent: any) => {
      return await certificateRepository.findById(parent.certificateId);
    },
    user: async (parent: any) => {
      return await userRepository.findById(parent.userId);
    }
  }
}; 