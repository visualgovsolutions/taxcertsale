import { Link, useNavigate } from 'react-router-dom';
import { Button, Carousel, Accordion, Card } from 'flowbite-react';

function HomePage() {
  const navigate = useNavigate();

  // Custom button style that maintains text visibility on hover
  const buttonStyle = {
    color: 'white !important',
    backgroundColor: '#dc2626 !important',
    '&:hover': {
      color: 'white !important',
      backgroundColor: '#b91c1c !important',
    }
  };

  // Handler for county button clicks
  const handleCountyClick = (countyName: string) => {
    navigate('/login', { state: { county: countyName } });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Company Logo and Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-red-600">Florida Tax Certificate Sales</h2>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero mb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
            Florida Tax Certificate Sales
          </h1>
          <div className="flex items-center">
            <span className="mr-4 text-white">VisualGov Solutions LLC</span>
            <img 
              src="/public/VG.png" 
              alt="VisualGov Solutions Logo" 
              className="h-12 w-auto"
            />
          </div>
        </div>
        <p className="text-xl text-gray-100 mb-8 max-w-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
          Your trusted source for tax certificate information in Florida. 
          Participate in auctions, discover investment opportunities, and manage your tax certificate portfolio.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <Button 
              color="red" 
              size="lg" 
              className="font-medium text-white hover:text-white !text-white !bg-red-600 hover:!bg-red-700"
              style={buttonStyle}
            >
              Sign In
            </Button>
          </Link>
          <Link to="/search">
            <Button outline color="light" size="lg" className="font-medium">
              Search Certificates
            </Button>
          </Link>
        </div>
      </div>

      {/* Test Site Link Banner */}
      <div className="p-4 mb-12 text-center bg-blue-100 border border-blue-200 rounded-lg">
        <p className="text-blue-800 font-medium">
          New to tax certificates? Try our demo environment first!
          <Link to="/demo" className="ml-2 font-bold underline">
            Access Test Site
          </Link>
        </p>
      </div>

      {/* How It Works Section */}
      <h2 className="section-header">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="max-w-sm">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl">1</div>
          </div>
          <h5 className="text-lg font-bold text-center mb-2">Register & Browse</h5>
          <p className="text-gray-700 text-center">
            Create an account and browse upcoming certificate auctions by county, property type, or tax amount.
          </p>
        </Card>
        <Card className="max-w-sm">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl">2</div>
          </div>
          <h5 className="text-lg font-bold text-center mb-2">Participate in Auctions</h5>
          <p className="text-gray-700 text-center">
            Place bids on certificates during county auctions. The lowest interest rate bid wins the certificate.
          </p>
        </Card>
        <Card className="max-w-sm">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl">3</div>
          </div>
          <h5 className="text-lg font-bold text-center mb-2">Track & Manage</h5>
          <p className="text-gray-700 text-center">
            Monitor your certificates, track redemptions, and manage your tax certificate portfolio all in one place.
          </p>
        </Card>
      </div>

      {/* Feature Cards */}
      <h2 className="section-header">What We Offer</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="feature-card">
          <h5 className="card-title">
            Tax Certificate Information
          </h5>
          <p className="card-body mb-4">
            Access current tax certificate listings, auction schedules, and track certificates across all 67 Florida counties.
          </p>
          <Link to="/certificates">
            <Button color="red" className="mt-2 text-white hover:text-white !text-white !bg-red-600 hover:!bg-red-700 font-medium">
              View Certificates <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </Button>
          </Link>
        </div>
        <div className="feature-card">
          <h5 className="card-title">
            County Auction Calendar
          </h5>
          <p className="card-body mb-4">
            Stay informed about upcoming tax certificate auctions with our comprehensive county-by-county calendar.
          </p>
          <Link to="/calendar">
            <Button color="red" className="mt-2 text-white hover:text-white !text-white !bg-red-600 hover:!bg-red-700 font-medium">
              View Calendar <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </Button>
          </Link>
        </div>
        <div className="feature-card">
          <h5 className="card-title">
            Investment Resources
          </h5>
          <p className="card-body mb-4">
            Learn about tax certificate investing with our educational resources, guides, and return-on-investment calculators.
          </p>
          <Link to="/resources">
            <Button color="red" className="mt-2 text-white hover:text-white !text-white !bg-red-600 hover:!bg-red-700 font-medium">
              Explore Resources <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Participating Counties */}
      <h2 className="section-header">Participating Counties</h2>
      <div className="mb-12">
        <p className="text-gray-700 mb-6">Our platform supports tax certificate auctions in the following Florida counties:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'Baker', 'Bradford', 'Calhoun', 'Desoto',
            'Franklin', 'Glades', 'Gulf', 'Hamilton',
            'Hardee', 'Holmes', 'Jefferson', 'Jackson',
            'Liberty', 'Okeechobee', 'Wakulla', 'Madison', 
            'Washington'
          ].map((county) => (
            <button 
              key={county} 
              onClick={() => handleCountyClick(county)} 
              className="block p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center border border-gray-400 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {county}
            </button>
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="https://www.flataxsales.com/Home.aspx" target="_blank" rel="noopener noreferrer">
            <Button color="red" outline size="sm" className="text-white hover:text-white border-red-600">
              Official Florida Tax Sale Portal
            </Button>
          </a>
        </div>
      </div>
      
      {/* Carousel */}
      <h2 className="section-header">Featured Information</h2>
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 mb-12 shadow-md rounded-lg overflow-hidden">
        <Carousel>
          <div className="flex h-full items-center justify-center bg-gradient-to-r from-red-800 to-red-600 dark:bg-gray-700 dark:text-white">
            <div className="text-center p-5 bg-white bg-opacity-90 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-red-700">2023 Tax Certificate Sales</h3>
              <p className="text-gray-700">Most Florida counties hold tax certificate auctions in May and June. Check our calendar for specific dates.</p>
            </div>
          </div>
          <div className="flex h-full items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 dark:bg-gray-700 dark:text-white">
            <div className="text-center p-5 bg-white bg-opacity-90 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800">Certificate Redemption</h3>
              <p className="text-gray-700">Property owners can redeem certificates by paying taxes plus interest to the county tax collector.</p>
            </div>
          </div>
          <div className="flex h-full items-center justify-center bg-gradient-to-r from-red-700 to-gray-900 dark:bg-gray-700 dark:text-white">
            <div className="text-center p-5 bg-white bg-opacity-90 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800">Investment Returns</h3>
              <p className="text-gray-700">Tax certificates in Florida can earn between 0.25% and 18% interest depending on the winning bid.</p>
            </div>
          </div>
        </Carousel>
      </div>
      
      {/* Understanding Tax Certificates Links */}
      <h2 className="section-header">Understanding Tax Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link to="/guides/beginners-guide" className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
          <h5 className="mb-2 text-lg font-bold text-gray-900">Beginner's Guide to Tax Certificates</h5>
          <p className="text-gray-700">Learn the basics of tax certificates, how they work, and how to get started investing.</p>
        </Link>
        <Link to="/guides/investment-strategy" className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
          <h5 className="mb-2 text-lg font-bold text-gray-900">Investment Strategies</h5>
          <p className="text-gray-700">Discover different approaches to investing in tax certificates and maximizing returns.</p>
        </Link>
        <Link to="/guides/tax-deed-process" className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
          <h5 className="mb-2 text-lg font-bold text-gray-900">The Tax Deed Process</h5>
          <p className="text-gray-700">Understand what happens when a certificate is not redeemed and the tax deed process begins.</p>
        </Link>
        <Link to="/guides/legal-considerations" className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
          <h5 className="mb-2 text-lg font-bold text-gray-900">Legal Considerations</h5>
          <p className="text-gray-700">Important legal aspects of tax certificate investing that every investor should know.</p>
        </Link>
      </div>
      
      {/* FAQ Section */}
      <h2 className="section-header">Tax Certificate FAQs</h2>
      <div className="mb-12">
        <Accordion>
          <Accordion.Panel>
            <Accordion.Title>What is a Tax Certificate?</Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-700">
                A tax certificate is a lien on property created when the property owner fails to pay property taxes. 
                The certificate represents the unpaid taxes plus interest and fees. Florida counties auction these 
                certificates to investors, who then earn interest on the debt.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>How do Tax Certificate Auctions work?</Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-700">
                In Florida, tax certificates are sold at public auction, typically in May and June each year. 
                The certificates are awarded to the bidder willing to accept the lowest interest rate, 
                starting from 18% and bidding down. All certificates earn at least 0.25% interest.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>How do I get paid as a certificate holder?</Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-700">
                When the property owner pays their delinquent taxes, the county tax collector pays you your investment plus the interest you bid. 
                Most certificates are redeemed within two years. If not redeemed after two years, you may apply for a tax deed to potentially 
                acquire ownership of the property.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>Are Tax Certificates a safe investment?</Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-700">
                Tax certificates are generally considered relatively secure investments because they're backed by real property. 
                However, like any investment, they carry risks. You should research properties carefully before bidding, 
                and understand that while most certificates are redeemed, some may not be.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>What happens if a certificate is not redeemed?</Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-700">
                If a tax certificate remains unredeemed for two years, the certificate holder can apply for a tax deed. 
                This initiates a process that may lead to a public auction of the property. The certificate holder is guaranteed 
                to recover their investment plus interest from the proceeds of the tax deed sale.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
      
      {/* Call to Action */}
      <div className="hero text-center mb-0">
        <h2 className="text-3xl font-bold mb-4 text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>Start Investing in Tax Certificates</h2>
        <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
          Join thousands of investors who use our platform to discover and track tax certificate opportunities across Florida.
        </p>
        <Link to="/register">
          <Button 
            color="red" 
            size="lg" 
            className="font-medium text-white hover:text-white !text-white !bg-red-600 hover:!bg-red-700"
            style={buttonStyle}
          >
            Create an Account
          </Button>
        </Link>
      </div>
      
      {/* Footer with Company Info */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600">
        <p>© {new Date().getFullYear()} VisualGov Solutions LLC. All rights reserved.</p>
        <p className="text-sm mt-2">Designed and developed by VisualGov Solutions LLC</p>
      </div>
    </div>
  );
}

export default HomePage; 