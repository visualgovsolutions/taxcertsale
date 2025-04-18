"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postgresPool_1 = require("../../database/postgresPool");
const AuctionService_1 = require("../services/auction/AuctionService");
const router = (0, express_1.Router)();
const pool = (0, postgresPool_1.getPostgresPool)();
// Create a dummy Socket.io server for use with the AuctionService
// This is temporary until we refactor to better separate the WebSocket and REST functionality
const dummyIo = {
    emit: () => { },
    on: () => { },
    to: () => ({ emit: () => { } }),
};
const auctionService = new AuctionService_1.AuctionService(dummyIo, pool);
// Get all auctions
router.get('/', async (_req, res) => {
    try {
        const auctions = await auctionService.getAllAuctions();
        res.status(200).json(auctions);
        return;
    }
    catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).json({ message: 'Failed to retrieve auctions' });
        return;
    }
});
// Get upcoming auctions
router.get('/upcoming', async (_req, res) => {
    try {
        const auctions = await auctionService.getUpcomingAuctions();
        res.status(200).json(auctions);
        return;
    }
    catch (error) {
        console.error('Error fetching upcoming auctions:', error);
        res.status(500).json({ message: 'Failed to retrieve upcoming auctions' });
        return;
    }
});
// Get auction by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Auction ID is required' });
        }
        const auction = await auctionService.getAuctionById(id);
        if (!auction) {
            return res.status(404).json({ message: `Auction with ID ${id} not found` });
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        console.error('Error fetching auction:', error);
        res.status(500).json({ message: 'Failed to retrieve auction' });
        return;
    }
});
// Create new auction
router.post('/', async (req, res) => {
    try {
        const auctionData = req.body;
        const newAuction = await auctionService.createAuction(auctionData);
        res.status(201).json(newAuction);
        return;
    }
    catch (error) {
        console.error('Error creating auction:', error);
        res.status(500).json({ message: 'Failed to create auction' });
        return;
    }
});
// Update auction
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Auction ID is required' });
        }
        const auctionData = req.body;
        const updatedAuction = await auctionService.updateAuction(id, auctionData);
        if (!updatedAuction) {
            return res.status(404).json({ message: `Auction with ID ${id} not found` });
        }
        res.status(200).json(updatedAuction);
        return;
    }
    catch (error) {
        console.error('Error updating auction:', error);
        res.status(500).json({ message: 'Failed to update auction' });
        return;
    }
});
// Delete auction
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Auction ID is required' });
        }
        const result = await auctionService.deleteAuction(id);
        if (!result) {
            return res.status(404).json({ message: `Auction with ID ${id} not found` });
        }
        res.status(204).send();
        return;
    }
    catch (error) {
        console.error('Error deleting auction:', error);
        res.status(500).json({ message: 'Failed to delete auction' });
        return;
    }
});
// Start auction
router.post('/:id/start', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Auction ID is required' });
        }
        const auction = await auctionService.startAuction(id);
        if (!auction) {
            return res.status(404).json({ message: `Auction with ID ${id} not found` });
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        console.error('Error starting auction:', error);
        res.status(500).json({ message: 'Failed to start auction' });
        return;
    }
});
// End auction
router.post('/:id/end', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Auction ID is required' });
        }
        const auction = await auctionService.endAuction(id);
        if (!auction) {
            return res.status(404).json({ message: `Auction with ID ${id} not found` });
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        console.error('Error ending auction:', error);
        res.status(500).json({ message: 'Failed to end auction' });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=auctions.routes.js.map