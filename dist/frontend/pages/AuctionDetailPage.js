"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const flowbite_react_1 = require("flowbite-react");
const hi_1 = require("react-icons/hi");
const AuctionDetailPage = () => {
    const { id } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [auction, setAuction] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchAuction = async () => {
            try {
                setLoading(true);
                // Commented out axios call
                // const response = await axios.get(`/api/v1/auctions/${id}/certificates`);
                // setAuction(response.data);
                // Using mock data instead
                const mockAuction = {
                    id: id || '1',
                    name: 'Miami-Dade County Tax Certificate Auction',
                    auctionDate: '2024-08-15',
                    startTime: '10:00 AM',
                    endTime: '4:00 PM',
                    status: 'scheduled',
                    description: 'Annual tax certificate auction for Miami-Dade County properties with delinquent taxes. Certificates are sold to investors who pay the delinquent taxes in exchange for a competitive bid interest rate.',
                    location: 'Online via Miami-Dade County Tax Collector Website',
                    registrationUrl: 'https://www.miamidade.gov/taxcollector',
                    county: {
                        id: '1',
                        name: 'Miami-Dade',
                        state: 'FL',
                    },
                    certificates: [
                        {
                            id: '101',
                            certificateNumber: 'MD-2024-001',
                            faceValue: 5000.0,
                            interestRate: 18.0,
                            status: 'available',
                            property: {
                                id: '1001',
                                parcelId: '01-1234-567-8901',
                                address: '123 Ocean Drive',
                                city: 'Miami Beach',
                                zipCode: '33139',
                            },
                        },
                        {
                            id: '102',
                            certificateNumber: 'MD-2024-002',
                            faceValue: 3200.5,
                            interestRate: 16.0,
                            status: 'available',
                            property: {
                                id: '1002',
                                parcelId: '01-2345-678-9012',
                                address: '456 Palm Avenue',
                                city: 'Miami',
                                zipCode: '33133',
                            },
                        },
                    ],
                    metadata: {},
                };
                setAuction(mockAuction);
                setLoading(false);
            }
            catch (err) {
                setError('Failed to load auction details. Please try again later.');
                setLoading(false);
            }
        };
        if (id) {
            fetchAuction();
        }
    }, [id]);
    const formatDate = (dateString) => {
        // Commented out date-fns usage
        // const date = new Date(dateString);
        // return format(date, 'MMMM d, yyyy');
        // Using basic JS Date formatting instead
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };
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
    const getCertificateStatusBadge = (status) => {
        switch (status) {
            case 'available':
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "success", children: "Available" });
            case 'sold':
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "purple", children: "Sold" });
            case 'redeemed':
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "info", children: "Redeemed" });
            default:
                return (0, jsx_runtime_1.jsx)(flowbite_react_1.Badge, { color: "gray", children: "Unknown" });
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center p-8 h-full", children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Spinner, { size: "xl" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsxs)(flowbite_react_1.Alert, { color: "failure", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Error!" }), " ", error] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 flex justify-center", children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: "gray", onClick: () => navigate('/auctions'), children: "Back to Auctions" }) })] }));
    }
    if (!auction) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsxs)(flowbite_react_1.Alert, { color: "warning", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Not Found!" }), " Auction not found."] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 flex justify-center", children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: "gray", onClick: () => navigate('/auctions'), children: "Back to Auctions" }) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row justify-between items-start mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: "gray", size: "sm", onClick: () => navigate('/auctions'), className: "mb-2", children: "\u2190 Back to Auctions" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold", children: auction.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: [auction.county.name, " County, ", auction.county.state] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 md:mt-0", children: getStatusBadge(auction.status) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Card, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(hi_1.HiCalendar, { className: "w-5 h-5 text-gray-500 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-500", children: "Date" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-semibold", children: formatDate(auction.auctionDate) })] })] }) }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Card, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(hi_1.HiClock, { className: "w-5 h-5 text-gray-500 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-500", children: "Time" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-lg font-semibold", children: [auction.startTime, " - ", auction.endTime] })] })] }) }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Card, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(hi_1.HiLocationMarker, { className: "w-5 h-5 text-gray-500 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-500", children: "Location" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-semibold", children: auction.location })] })] }) })] }), (0, jsx_runtime_1.jsxs)(flowbite_react_1.Tabs.Group, { style: "underline", children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Tabs.Item, { title: "Overview", icon: hi_1.HiInformationCircle, active: true, children: (0, jsx_runtime_1.jsxs)(flowbite_react_1.Card, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold mb-2", children: "Description" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-700 whitespace-pre-line", children: auction.description || 'No description available.' })] }), auction.registrationUrl && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4", children: (0, jsx_runtime_1.jsxs)(flowbite_react_1.Button, { color: "dark", onClick: () => window.open(auction.registrationUrl, '_blank'), children: [(0, jsx_runtime_1.jsx)(hi_1.HiExternalLink, { className: "mr-2 h-5 w-5" }), "Register for Auction"] }) }))] }) }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Tabs.Item, { title: `Certificates (${auction.certificates?.length || 0})`, children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Card, { children: auction.certificates?.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)(flowbite_react_1.Table, { striped: true, children: [(0, jsx_runtime_1.jsxs)(flowbite_react_1.Table.Head, { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Certificate Number" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Property Address" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Parcel ID" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Face Value" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Interest Rate" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Status" }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.HeadCell, { children: "Actions" })] }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Body, { className: "divide-y", children: auction.certificates.map(certificate => ((0, jsx_runtime_1.jsxs)(flowbite_react_1.Table.Row, { className: "bg-white dark:border-gray-700 dark:bg-gray-800", children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { className: "whitespace-nowrap font-medium text-gray-900 dark:text-white", children: certificate.certificateNumber }), (0, jsx_runtime_1.jsxs)(flowbite_react_1.Table.Cell, { children: [certificate.property.address, (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: [certificate.property.city, ", ", certificate.property.zipCode] })] }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: certificate.property.parcelId }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: formatCurrency(certificate.faceValue) }), (0, jsx_runtime_1.jsxs)(flowbite_react_1.Table.Cell, { children: [certificate.interestRate, "%"] }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: getCertificateStatusBadge(certificate.status) }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Table.Cell, { children: (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { color: "light", size: "xs", onClick: () => navigate(`/certificates/${certificate.id}`), children: "View Details" }) })] }, certificate.id))) })] }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "No certificates are available for this auction yet." }) })) }) })] })] }));
};
exports.default = AuctionDetailPage;
//# sourceMappingURL=AuctionDetailPage.js.map