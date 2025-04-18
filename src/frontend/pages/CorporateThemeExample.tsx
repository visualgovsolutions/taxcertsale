import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const CorporateThemeExample: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Corporate Theme Example</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">Primary Variants</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary">Default</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">Secondary Variants</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">Small</Button>
              <Button variant="secondary">Default</Button>
              <Button variant="secondary" size="lg">Large</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">Outline Variants</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Small</Button>
              <Button variant="outline">Default</Button>
              <Button variant="outline" size="lg">Large</Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Basic Card">
            <p className="text-gray-700">This is a basic card with a title and content.</p>
          </Card>
          
          <Card 
            title="Card with Footer" 
            footer={
              <div className="flex justify-end">
                <Button variant="primary" size="sm">Action</Button>
              </div>
            }
          >
            <p className="text-gray-700">This card includes a footer with an action button.</p>
          </Card>
          
          <Card 
            title="Hover Effect Card" 
            hoverEffect={true} 
            bordered={true}
          >
            <p className="text-gray-700">This card has a hover effect and border.</p>
          </Card>
          
          <Card elevation="lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Header Card</h3>
            <p className="text-gray-700">This card has no header but larger elevation.</p>
          </Card>
          
          <Card 
            title="Auction Details" 
            headerClassName="bg-red-50"
          >
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Date:</span> August 15, 2023</p>
              <p className="text-gray-700"><span className="font-medium">Location:</span> City Hall</p>
              <p className="text-gray-700"><span className="font-medium">Properties:</span> 24</p>
            </div>
          </Card>
          
          <Card 
            className="bg-gray-900 text-white"
            title="Dark Card"
            headerClassName="bg-gray-800 border-gray-700"
            bodyClassName="text-gray-100"
          >
            <p>Dark themed card for contrast.</p>
            <div className="mt-4">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </section>
      
      <section>
        <Card title="Corporate Design System" bordered={true}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Corporate Theme</h3>
              <p className="text-gray-700">
                This example page demonstrates the corporate theme components including buttons and cards 
                with variations that follow our corporate color scheme of red, black, and white.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" fullWidth>View Auctions</Button>
              <Button variant="secondary" fullWidth>Properties</Button>
              <Button variant="outline" fullWidth>Contact</Button>
            </div>
          </div>
        </Card>
      </section>
      
      <div className="mt-8 text-center">
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default CorporateThemeExample; 