import { auctionService } from '../services';
import { AuctionStatus } from '../models/entities/auction.entity';
import { Request, Response } from 'express';

export const findAllAuctions = async (req: Request, res: Response) => {
  try {
    const countyId = typeof req.query.county === 'string' ? req.query.county : '';
    const auctions = countyId
      ? await auctionService.findByCounty(countyId)
      : await auctionService.findAll();
    res.status(200).json(auctions);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions', error });
    return;
  }
};

export const findUpcomingAuctions = async (_req: Request, res: Response) => {
  try {
    const auctions = await auctionService.findUpcoming();
    res.status(200).json(auctions);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming auctions', error });
    return;
  }
};

export const findAuctionById = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    if (!id) return res.status(400).json({ message: 'Missing auction id' });
    const auction = await auctionService.findById(id);
    if (!auction) {
      res.status(404).json({ message: `Auction with ID ${id} not found` });
      return;
    }
    res.status(200).json(auction);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auction', error });
    return;
  }
};

export const findWithCertificates = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    if (!id) return res.status(400).json({ message: 'Missing auction id' });
    const auction = await auctionService.findWithCertificates(id);
    if (!auction) {
      res.status(404).json({ message: `Auction with ID ${id} not found` });
      return;
    }
    res.status(200).json(auction);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auction with certificates', error });
    return;
  }
};

export const createAuction = async (req: Request, res: Response) => {
  try {
    const auctionData = req.body;
    const auction = await auctionService.create(auctionData);
    res.status(201).json(auction);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating auction', error });
    return;
  }
};

export const updateAuction = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    if (!id) return res.status(400).json({ message: 'Missing auction id' });
    const auctionData = req.body;
    const auction = await auctionService.update(id, auctionData);
    if (!auction) {
      res.status(404).json({ message: `Auction with ID ${id} not found` });
      return;
    }
    res.status(200).json(auction);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error updating auction', error });
    return;
  }
};

export const deleteAuction = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    if (!id) return res.status(400).json({ message: 'Missing auction id' });
    const success = await auctionService.delete(id);
    if (!success) {
      res.status(404).json({ message: `Auction with ID ${id} not found` });
      return;
    }
    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error deleting auction', error });
    return;
  }
};

export const activateAuction = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    if (!id) return res.status(400).json({ message: 'Missing auction id' });
    const auction = await auctionService.activateAuction(id);
    if (!auction) {
      res.status(404).json({ message: `Auction with ID ${id} not found` });
      return;
    }
    res.status(200).json(auction);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error activating auction', error });
    return;
  }
};

export const completeAuction = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    if (!id) return res.status(400).json({ message: 'Missing auction id' });
    const auction = await auctionService.completeAuction(id);
    if (!auction) {
      res.status(404).json({ message: `Auction with ID ${id} not found` });
      return;
    }
    res.status(200).json(auction);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error completing auction', error });
    return;
  }
};

export const cancelAuction = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    if (!id) return res.status(400).json({ message: 'Missing auction id' });
    const auction = await auctionService.cancelAuction(id);
    if (!auction) {
      res.status(404).json({ message: `Auction with ID ${id} not found` });
      return;
    }
    res.status(200).json(auction);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling auction', error });
    return;
  }
};

export const findByCounty = async (req: Request, res: Response) => {
  try {
    const countyId = typeof req.params.countyId === 'string' ? req.params.countyId : '';
    if (!countyId) return res.status(400).json({ message: 'Missing countyId' });
    const auctions = await auctionService.findByCounty(countyId);
    res.status(200).json(auctions);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions by county', error });
    return;
  }
};

export const findByStatus = async (req: Request, res: Response) => {
  try {
    const status = typeof req.params.status === 'string' ? req.params.status as AuctionStatus : '';
    if (!status || !Object.values(AuctionStatus).includes(status as AuctionStatus)) {
      res.status(400).json({ message: `Invalid status: ${status}` });
      return;
    }
    const auctions = await auctionService.findByStatus(status as AuctionStatus);
    res.status(200).json(auctions);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions by status', error });
    return;
  }
};

export const findActiveAuctions = async (_req: Request, res: Response) => {
  try {
    const auctions = await auctionService.findActive();
    res.status(200).json(auctions);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active auctions', error });
    return;
  }
};

export const findCompletedAuctions = async (_req: Request, res: Response) => {
  try {
    const auctions = await auctionService.findCompleted();
    res.status(200).json(auctions);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed auctions', error });
    return;
  }
};
