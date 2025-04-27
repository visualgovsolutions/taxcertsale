import { createBrowserRouter } from 'react-router-dom';
import BidderBidsPage from './pages/bidder/BidderBidsPage';
import BidderAuctionsPage from './pages/bidder/BidderAuctionsPage';
import ParcelDetailsPage from './pages/bidder/ParcelDetailsPage';
import BidderDashboardPage from './pages/bidder/BidderDashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BidderDashboardPage />,
  },
  {
    path: '/bidder/dashboard',
    element: <BidderDashboardPage />,
  },
  {
    path: '/bidder/auctions',
    element: <BidderAuctionsPage />,
  },
  {
    path: '/bidder/parcels/:id',
    element: <ParcelDetailsPage />,
  },
]); 