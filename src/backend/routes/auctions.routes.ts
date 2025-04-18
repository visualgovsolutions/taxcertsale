import { Router, Request, Response } from 'express';
import { getPostgresPool } from '../../database/postgresPool';
import { AuctionService } from '../services/auction/AuctionService';

const router = Router();
const pool = getPostgresPool();
const auctionService = new AuctionService(null, pool);

// Get all auctions
router.get('/', async (_req: Request, res: Response) => {
  try {
    const auctions = await auctionService.getAllAuctions();
    res.status(200).json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ message: 'Failed to retrieve auctions' });
  }
});

// Get upcoming auctions
router.get('/upcoming', async (_req: Request, res: Response) => {
  try {
    const auctions = await auctionService.getUpcomingAuctions();
    res.status(200).json(auctions);
  } catch (error) {
    console.error('Error fetching upcoming auctions:', error);
    res.status(500).json({ message: 'Failed to retrieve upcoming auctions' });
  }
});

// Get auction by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const auction = await auctionService.getAuctionById(id);

    if (!auction) {
      return res.status(404).json({ message: `Auction with ID ${id} not found` });
    }

    res.status(200).json(auction);
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ message: 'Failed to retrieve auction' });
  }
});

// Create new auction
router.post('/', async (req: Request, res: Response) => {
  try {
    const auctionData = req.body;
    const newAuction = await auctionService.createAuction(auctionData);
    res.status(201).json(newAuction);
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ message: 'Failed to create auction' });
  }
});

// Update auction
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const auctionData = req.body;
    const updatedAuction = await auctionService.updateAuction(id, auctionData);

    if (!updatedAuction) {
      return res.status(404).json({ message: `Auction with ID ${id} not found` });
    }

    res.status(200).json(updatedAuction);
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ message: 'Failed to update auction' });
  }
});

// Delete auction
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await auctionService.deleteAuction(id);

    if (!result) {
      return res.status(404).json({ message: `Auction with ID ${id} not found` });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ message: 'Failed to delete auction' });
  }
});

// Start auction
router.post('/:id/start', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const auction = await auctionService.startAuction(id);
    res.status(200).json(auction);
  } catch (error) {
    console.error('Error starting auction:', error);
    res.status(500).json({ message: 'Failed to start auction' });
  }
});

// End auction
router.post('/:id/end', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const auction = await auctionService.endAuction(id);
    res.status(200).json(auction);
  } catch (error) {
    console.error('Error ending auction:', error);
    res.status(500).json({ message: 'Failed to end auction' });
  }
});

export default router;
