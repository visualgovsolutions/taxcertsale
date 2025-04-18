"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCompletedAuctions = exports.findActiveAuctions = exports.findByStatus = exports.findByCounty = exports.cancelAuction = exports.completeAuction = exports.activateAuction = exports.deleteAuction = exports.updateAuction = exports.createAuction = exports.findWithCertificates = exports.findAuctionById = exports.findUpcomingAuctions = exports.findAllAuctions = void 0;
const services_1 = require("../services");
const entities_1 = require("../models/entities");
const findAllAuctions = async (req, res) => {
    try {
        const countyId = typeof req.query.county === 'string' ? req.query.county : '';
        const auctions = countyId
            ? await services_1.auctionService.findByCounty(countyId)
            : await services_1.auctionService.findAll();
        res.status(200).json(auctions);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching auctions', error });
        return;
    }
};
exports.findAllAuctions = findAllAuctions;
const findUpcomingAuctions = async (req, res) => {
    try {
        const auctions = await services_1.auctionService.findUpcoming();
        res.status(200).json(auctions);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming auctions', error });
        return;
    }
};
exports.findUpcomingAuctions = findUpcomingAuctions;
const findAuctionById = async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : '';
        if (!id)
            return res.status(400).json({ message: 'Missing auction id' });
        const auction = await services_1.auctionService.findById(id);
        if (!auction) {
            res.status(404).json({ message: `Auction with ID ${id} not found` });
            return;
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching auction', error });
        return;
    }
};
exports.findAuctionById = findAuctionById;
const findWithCertificates = async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : '';
        if (!id)
            return res.status(400).json({ message: 'Missing auction id' });
        const auction = await services_1.auctionService.findWithCertificates(id);
        if (!auction) {
            res.status(404).json({ message: `Auction with ID ${id} not found` });
            return;
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching auction with certificates', error });
        return;
    }
};
exports.findWithCertificates = findWithCertificates;
const createAuction = async (req, res) => {
    try {
        const auctionData = req.body;
        const auction = await services_1.auctionService.create(auctionData);
        res.status(201).json(auction);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating auction', error });
        return;
    }
};
exports.createAuction = createAuction;
const updateAuction = async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : '';
        if (!id)
            return res.status(400).json({ message: 'Missing auction id' });
        const auctionData = req.body;
        const auction = await services_1.auctionService.update(id, auctionData);
        if (!auction) {
            res.status(404).json({ message: `Auction with ID ${id} not found` });
            return;
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating auction', error });
        return;
    }
};
exports.updateAuction = updateAuction;
const deleteAuction = async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : '';
        if (!id)
            return res.status(400).json({ message: 'Missing auction id' });
        const success = await services_1.auctionService.delete(id);
        if (!success) {
            res.status(404).json({ message: `Auction with ID ${id} not found` });
            return;
        }
        res.status(204).send();
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting auction', error });
        return;
    }
};
exports.deleteAuction = deleteAuction;
const activateAuction = async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : '';
        if (!id)
            return res.status(400).json({ message: 'Missing auction id' });
        const auction = await services_1.auctionService.activateAuction(id);
        if (!auction) {
            res.status(404).json({ message: `Auction with ID ${id} not found` });
            return;
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error activating auction', error });
        return;
    }
};
exports.activateAuction = activateAuction;
const completeAuction = async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : '';
        if (!id)
            return res.status(400).json({ message: 'Missing auction id' });
        const auction = await services_1.auctionService.completeAuction(id);
        if (!auction) {
            res.status(404).json({ message: `Auction with ID ${id} not found` });
            return;
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error completing auction', error });
        return;
    }
};
exports.completeAuction = completeAuction;
const cancelAuction = async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : '';
        if (!id)
            return res.status(400).json({ message: 'Missing auction id' });
        const auction = await services_1.auctionService.cancelAuction(id);
        if (!auction) {
            res.status(404).json({ message: `Auction with ID ${id} not found` });
            return;
        }
        res.status(200).json(auction);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error cancelling auction', error });
        return;
    }
};
exports.cancelAuction = cancelAuction;
const findByCounty = async (req, res) => {
    try {
        const countyId = typeof req.params.countyId === 'string' ? req.params.countyId : '';
        if (!countyId)
            return res.status(400).json({ message: 'Missing countyId' });
        const auctions = await services_1.auctionService.findByCounty(countyId);
        res.status(200).json(auctions);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching auctions by county', error });
        return;
    }
};
exports.findByCounty = findByCounty;
const findByStatus = async (req, res) => {
    try {
        const status = typeof req.params.status === 'string' ? req.params.status : '';
        if (!status || !Object.values(entities_1.AuctionStatus).includes(status)) {
            res.status(400).json({ message: `Invalid status: ${status}` });
            return;
        }
        const auctions = await services_1.auctionService.findByStatus(status);
        res.status(200).json(auctions);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching auctions by status', error });
        return;
    }
};
exports.findByStatus = findByStatus;
const findActiveAuctions = async (req, res) => {
    try {
        const auctions = await services_1.auctionService.findActive();
        res.status(200).json(auctions);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching active auctions', error });
        return;
    }
};
exports.findActiveAuctions = findActiveAuctions;
const findCompletedAuctions = async (req, res) => {
    try {
        const auctions = await services_1.auctionService.findCompleted();
        res.status(200).json(auctions);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching completed auctions', error });
        return;
    }
};
exports.findCompletedAuctions = findCompletedAuctions;
//# sourceMappingURL=auction.controller.js.map