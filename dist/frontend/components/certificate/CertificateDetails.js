"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const CertificateDetails = ({ certificate }) => {
    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };
    // Format date for display
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };
    // Get status label with appropriate styling
    const getStatusLabel = (status) => {
        let statusClass = '';
        let label = '';
        switch (status) {
            case 'upcoming':
                statusClass = 'status-upcoming';
                label = 'Upcoming';
                break;
            case 'active':
                statusClass = 'status-active';
                label = 'Active';
                break;
            case 'closed':
                statusClass = 'status-closed';
                label = 'Closed';
                break;
            case 'redeemed':
                statusClass = 'status-redeemed';
                label = 'Redeemed';
                break;
            default:
                statusClass = '';
                label = status;
        }
        return (0, jsx_runtime_1.jsx)("span", { className: `status-badge ${statusClass}`, children: label });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "certificate-details", children: [(0, jsx_runtime_1.jsxs)("div", { className: "certificate-header", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Certificate Details" }), getStatusLabel(certificate.status)] }), (0, jsx_runtime_1.jsxs)("div", { className: "certificate-info-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "info-group", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Property Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Parcel ID:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: certificate.parcelId })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Owner:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: certificate.ownerName })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Address:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: certificate.propertyAddress })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "County:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: certificate.county })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-group", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Certificate Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Certificate ID:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: certificate.id })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Face Value:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: formatCurrency(certificate.faceValue) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Minimum Bid:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: formatCurrency(certificate.minimumBid) })] }), certificate.currentLowestBid !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "info-row current-lowest-bid", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Current Lowest Bid:" }), (0, jsx_runtime_1.jsxs)("span", { className: "value", children: [certificate.currentLowestBid, "%"] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-group", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Auction Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Start Time:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: formatDate(certificate.auctionStartTime) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "End Time:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: formatDate(certificate.auctionEndTime) })] })] })] })] }));
};
exports.default = CertificateDetails;
//# sourceMappingURL=CertificateDetails.js.map