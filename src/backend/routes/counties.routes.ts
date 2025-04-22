import { Router } from 'express';
import { countyController } from '../controllers/county.controller';

const router = Router();

// GET /counties - Get all counties
router.get('/', countyController.getAllCounties);

// GET /counties/:id - Get a specific county by ID
router.get('/:id', countyController.getCountyById);

// POST /counties - Create a new county
router.post('/', countyController.createCounty);

// PUT /counties/:id - Update a county
router.put('/:id', countyController.updateCounty);

// DELETE /counties/:id - Delete a county
router.delete('/:id', countyController.deleteCounty);

export default router; 