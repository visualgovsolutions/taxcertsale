"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BiddingSocketService_1 = require("../../services/socket/BiddingSocketService");
const BidHistory = ({ certificateId, currentUserId }) => {
    const [bids, setBids] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const socketService = BiddingSocketService_1.BiddingSocketService.getInstance();
    // Fetch initial bid history
    (0, react_1.useEffect)(() => {
        const fetchBidHistory = async () => {
            try {
                setLoading(true);
                // For now, we'll use mock data until we create an API endpoint for this
                // In a real implementation, you would fetch the bid history from the server
                const mockBids = [];
                setBids(mockBids);
                setError(null);
            }
            catch (err) {
                setError('Failed to load bid history');
                console.error('Error fetching bid history:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchBidHistory();
    }, [certificateId]);
    // Listen for new bids
    (0, react_1.useEffect)(() => {
        // Adjust handler to accept unknown args and perform type check inside
        const handleBidPlaced = (...args) => {
            // Assume the first argument is the data object
            const data = args[0]; // Use type assertion (or proper type guard)
            // Basic validation of the received data structure
            if (!data || typeof data !== 'object' || !data.certificateId || data.certificateId !== certificateId) {
                console.warn('Received bid_placed event with invalid data or for wrong certificate:', data);
                return;
            }
            // Proceed with validated data
            const newBid = {
                id: data.bidId || 'unknown', // Add fallback for safety
                certificateId: data.certificateId,
                bidderId: data.bidderId || 'unknown', // Add fallback for safety
                interestRate: typeof data.interestRate === 'number' ? data.interestRate : 0, // Add fallback
                timestamp: data.timestamp ? (typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp) : new Date(), // Ensure date
                status: 'active' // Assuming new bids are active
            };
            setBids(prevBids => [newBid, ...prevBids].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())); // Add sorting
        };
        socketService.on('bid_placed', handleBidPlaced);
        return () => {
            socketService.off('bid_placed', handleBidPlaced);
        };
    }, [certificateId, socketService]);
    // Format date for display
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };
    // Check if bid is from current user
    const isCurrentUser = (bidderId) => {
        return currentUserId !== undefined && bidderId === currentUserId;
    };
    // Truncate bidder ID for display
    const truncateBidderId = (bidderId) => {
        if (isCurrentUser(bidderId)) {
            return 'You';
        }
        return bidderId.substring(0, 8) + '...';
    };
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "bid-history-loading", children: "Loading bid history..." });
    }
    if (error) {
        return (0, jsx_runtime_1.jsx)("div", { className: "bid-history-error", children: error });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bid-history", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Bid History" }), bids.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "no-bids", children: "No bids have been placed on this certificate yet." })) : ((0, jsx_runtime_1.jsxs)("table", { className: "bid-table", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Bidder" }), (0, jsx_runtime_1.jsx)("th", { children: "Interest Rate" }), (0, jsx_runtime_1.jsx)("th", { children: "Time" }), (0, jsx_runtime_1.jsx)("th", { children: "Status" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: bids.map(bid => ((0, jsx_runtime_1.jsxs)("tr", { className: isCurrentUser(bid.bidderId) ? 'current-user-bid' : '', children: [(0, jsx_runtime_1.jsx)("td", { children: truncateBidderId(bid.bidderId) }), (0, jsx_runtime_1.jsxs)("td", { children: [bid.interestRate, "%"] }), (0, jsx_runtime_1.jsx)("td", { children: formatDate(bid.timestamp) }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("span", { className: `bid-status ${bid.status}`, children: bid.status }) })] }, bid.id))) })] }))] }));
};
exports.default = BidHistory;
//# sourceMappingURL=BidHistory.js.map