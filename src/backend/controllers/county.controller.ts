import { Request, Response } from 'express';
import prisma from '../../lib/prisma';

/**
 * Get all counties
 * @route GET /counties
 */
export const getAllCounties = async (req: Request, res: Response) => {
  try {
    const counties = await prisma.county.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.status(200).json(counties);
  } catch (error) {
    console.error('Error fetching counties:', error);
    res.status(500).json({ message: 'Error fetching counties', error });
  }
};

/**
 * Get a county by ID
 * @route GET /counties/:id
 */
export const getCountyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const county = await prisma.county.findUnique({
      where: { id }
    });
    
    if (!county) {
      return res.status(404).json({ message: 'County not found' });
    }
    
    res.status(200).json(county);
  } catch (error) {
    console.error(`Error fetching county with ID ${id}:`, error);
    res.status(500).json({ message: 'Error fetching county', error });
  }
};

/**
 * Create a new county
 * @route POST /counties
 */
export const createCounty = async (req: Request, res: Response) => {
  const data = req.body;
  
  // Validate required fields
  if (!data.name || !data.state) {
    return res.status(400).json({ message: 'Name and state are required fields' });
  }
  
  try {
    // Check if county already exists (by name)
    const existingCounty = await prisma.county.findUnique({
      where: { name: data.name }
    });
    
    if (existingCounty) {
      return res.status(409).json({ message: 'County with this name already exists' });
    }
    
    // Create new county
    const county = await prisma.county.create({
      data: {
        name: data.name,
        state: data.state,
        // Optional fields
        ...(data.countyCode && { countyCode: data.countyCode }),
        ...(data.websiteUrl && { websiteUrl: data.websiteUrl }),
        ...(data.taxCollectorUrl && { taxCollectorUrl: data.taxCollectorUrl }),
        ...(data.propertyAppraiserUrl && { propertyAppraiserUrl: data.propertyAppraiserUrl }),
        ...(data.description && { description: data.description }),
        ...(data.latitude && { latitude: typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude }),
        ...(data.longitude && { longitude: typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude })
      }
    });
    
    res.status(201).json(county);
  } catch (error) {
    console.error('Error creating county:', error);
    res.status(500).json({ message: 'Error creating county', error });
  }
};

/**
 * Update a county
 * @route PUT /counties/:id
 */
export const updateCounty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  
  try {
    // Check if county exists
    const existingCounty = await prisma.county.findUnique({
      where: { id }
    });
    
    if (!existingCounty) {
      return res.status(404).json({ message: 'County not found' });
    }
    
    // Check if another county with the same name exists (for name changes)
    if (data.name && data.name !== existingCounty.name) {
      const duplicateNameCounty = await prisma.county.findUnique({
        where: { name: data.name }
      });
      
      if (duplicateNameCounty) {
        return res.status(409).json({ message: 'Another county with this name already exists' });
      }
    }
    
    // Update the county
    const updatedCounty = await prisma.county.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.state && { state: data.state }),
        ...(data.countyCode !== undefined && { countyCode: data.countyCode || null }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl || null }),
        ...(data.taxCollectorUrl !== undefined && { taxCollectorUrl: data.taxCollectorUrl || null }),
        ...(data.propertyAppraiserUrl !== undefined && { propertyAppraiserUrl: data.propertyAppraiserUrl || null }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.latitude !== undefined && { 
          latitude: data.latitude 
            ? (typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude) 
            : null 
        }),
        ...(data.longitude !== undefined && { 
          longitude: data.longitude 
            ? (typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude) 
            : null 
        })
      }
    });
    
    res.status(200).json(updatedCounty);
  } catch (error) {
    console.error(`Error updating county with ID ${id}:`, error);
    res.status(500).json({ message: 'Error updating county', error });
  }
};

/**
 * Delete a county
 * @route DELETE /counties/:id
 */
export const deleteCounty = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Check if county exists
    const existingCounty = await prisma.county.findUnique({
      where: { id }
    });
    
    if (!existingCounty) {
      return res.status(404).json({ message: 'County not found' });
    }
    
    // Check for relationships that might prevent deletion
    const hasRelatedProperties = await prisma.property.count({
      where: { countyId: id }
    });
    
    const hasRelatedAuctions = await prisma.auction.count({
      where: { countyId: id }
    });
    
    const hasRelatedCertificates = await prisma.certificate.count({
      where: { countyId: id }
    });
    
    if (hasRelatedProperties > 0 || hasRelatedAuctions > 0 || hasRelatedCertificates > 0) {
      return res.status(409).json({ 
        message: 'Cannot delete county because it has related records',
        details: {
          properties: hasRelatedProperties,
          auctions: hasRelatedAuctions,
          certificates: hasRelatedCertificates
        }
      });
    }
    
    // Delete the county
    await prisma.county.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'County deleted successfully', id });
  } catch (error) {
    console.error(`Error deleting county with ID ${id}:`, error);
    res.status(500).json({ message: 'Error deleting county', error });
  }
};

// Export the controller as an object
export const countyController = {
  getAllCounties,
  getCountyById,
  createCounty,
  updateCounty,
  deleteCounty
}; 