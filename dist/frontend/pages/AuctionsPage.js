"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const flowbite_react_1 = require("flowbite-react");
const hi_1 = require("react-icons/hi");
const AuctionsPage = () => {
    const [auctions, setAuctions] = (0, react_1.useState)([]);
    const [filteredAuctions, setFilteredAuctions] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                // Commented out axios call
                // const response = await axios.get('/api/v1/auctions');
                // setAuctions(response.data);
                // setFilteredAuctions(response.data);
                // Using mock data instead
                const mockData = [
                    {
                        id: '1',
                        name: 'Miami-Dade County Tax Certificate Auction',
                        auctionDate: '2024-08-15',
                        startTime: '10:00 AM',
                        endTime: '4:00 PM',
                        status: 'scheduled',
                        location: 'Online',
                        county: { id: '1', name: 'Miami-Dade' },
                    },
                    {
                        id: '2',
                        name: 'Broward County Tax Certificate Auction',
                        auctionDate: '2024-09-01',
                        startTime: '9:00 AM',
                        endTime: '5:00 PM',
                        status: 'scheduled',
                        location: 'Online',
                        county: { id: '2', name: 'Broward' },
                    },
                ];
                setAuctions(mockData);
                setFilteredAuctions(mockData);
                setLoading(false);
            }
            catch (err) {
                setError('Failed to load auctions. Please try again later.');
                setLoading(false);
            }
        };
        fetchAuctions();
    }, []);
    (0, react_1.useEffect)(() => {
        // Apply filters
        let result = auctions;
        // Apply search term
        if (searchTerm) {
            result = result.filter(auction => auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.county.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.location.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(auction => auction.status === statusFilter);
        }
        setFilteredAuctions(result);
    }, [searchTerm, statusFilter, auctions]);
    const getStatusBadge = (status) => {
        switch (status) {
            case 'scheduled':
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "info", children: "Scheduled" });
            case 'in_progress':
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "warning", children: "In Progress" });
            case 'completed':
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "success", children: "Completed" });
            case 'cancelled':
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "failure", children: "Cancelled" });
            default:
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "gray", children: "Unknown" });
        }
    };
    const formatDate = (dateString) => {
        // Commented out date-fns usage
        // const date = new Date(dateString);
        // return format(date, 'MMM d, yyyy');
        // Using basic JS Date formatting instead
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold mb-8", children: "Tax Certificate Auctions" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-6 mb-8 md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)(flowbite_react_1.Card, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h5", { className: "text-xl font-bold leading-none text-gray-900 dark:text-white", children: "Search Auctions" }), (0, jsx_runtime_1.jsx)(hi_1.HiSearch, { className: "w-5 h-5 text-gray-500" })] }), (0, jsx_runtime_1.jsx)(flowbite_react_1.TextInput, { id: "search", type: "text", placeholder: "Search by name, county, or location", value: searchTerm, onChange: e => setSearchTerm(e.target.value), icon: hi_1.HiSearch })] }), (0, jsx_runtime_1.jsxs)(flowbite_react_1.Card, { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsx)("h5", { className: "text-xl font-bold leading-none text-gray-900 dark:text-white", children: "Filter by Status" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: statusFilter === 'all' ? 'dark' : 'light', onClick: () => setStatusFilter('all'), size: "sm", children: "All" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: statusFilter === 'scheduled' ? 'info' : 'light', onClick: () => setStatusFilter('scheduled'), size: "sm", children: "Scheduled" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: statusFilter === 'in_progress' ? 'warning' : 'light', onClick: () => setStatusFilter('in_progress'), size: "sm", children: "In Progress" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: statusFilter === 'completed' ? 'success' : 'light', onClick: () => setStatusFilter('completed'), size: "sm", children: "Completed" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: statusFilter === 'cancelled' ? 'failure' : 'light', onClick: () => setStatusFilter('cancelled'), size: "sm", children: "Cancelled" })] })] }), (0, jsx_runtime_1.jsxs)(flowbite_react_1.Card, { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsx)("h5", { className: "text-xl font-bold leading-none text-gray-900 dark:text-white", children: "Quick Actions" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col space-y-2", children: [(0, jsx_runtime_1.jsxs)(flowbite_react_1.Button, { color: "info", onClick: () => navigate('/auctions/upcoming'), children: [(0, jsx_runtime_1.jsx)(hi_1.HiCalendar, { className: "mr-2 h-5 w-5" }), "View Upcoming Auctions"] }), (0, jsx_runtime_1.jsxs)(flowbite_react_1.Button, { color: "light", onClick: () => navigate('/counties'), children: [(0, jsx_runtime_1.jsx)(hi_1.HiLocationMarker, { className: "mr-2 h-5 w-5" }), "Browse by County"] })] })] })] }), loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center p-8", children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Spinner, { size: "xl" }) })) : error ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center p-8 text-red-500", children: [(0, jsx_runtime_1.jsx)("p", { children: error }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: "failure", onClick: () => window.location.reload(), className: "mt-4", children: "Try Again" })] })) : ((0, jsx_runtime_1.jsx)(flowbite_react_1.Card, { children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)(flowbite_react_1.Table, { striped: true, children: [(0, jsx_runtime_1.jsxs)(flowbite_react_1.Table.Head, { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Name" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "County" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Date" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Time" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Location" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Status" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Actions" })] }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Body, { className: "divide-y", children: filteredAuctions.length > 0 ? (filteredAuctions.map(auction => ((0, jsx_runtime_1.jsxs)(flowbite_react_1.Table.Row, { className: "bg-white dark:border-gray-700 dark:bg-gray-800", children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { className: "whitespace-nowrap font-medium text-gray-900 dark:text-white", children: auction.name }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: auction.county.name }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: formatDate(auction.auctionDate) }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: `${auction.startTime} - ${auction.endTime}` }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: auction.location }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: getStatusBadge(auction.status) }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: "light", size: "sm", onClick: () => navigate(`/auctions/${auction.id}`), children: "View Details" }) })] }, auction.id)))) : ((0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Row, { children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { colSpan: 7, className: "text-center py-4", children: "No auctions found matching your criteria." }) })) })] }) }) }))] }));
};
exports.default = AuctionsPage;
//# sourceMappingURL=AuctionsPage.js.map