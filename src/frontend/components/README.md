# Flowbite with React Router Integration

This component demonstrates how to integrate Flowbite React components with React Router for a seamless navigation experience while maintaining compatibility with flowbite-react 0.5.0.

## Features

- Responsive layout that adapts to different screen sizes
- Collapsible sidebar for desktop view (toggle between full and icon-only modes)
- Mobile-friendly navigation with off-canvas sidebar
- Active route highlighting
- User dropdown menu with avatar
- Nested routes support with React Router's Outlet

## Components

### FlowbiteWithRouter

The main layout component that integrates Flowbite with React Router.

### LinkWrapper

A utility component that enables proper integration between Flowbite components and React Router's Link component. It handles passing the Link props while maintaining compatibility with flowbite-react 0.5.0.

## Version Compatibility

This project uses `flowbite-react` version 0.5.0, which has specific compatibility requirements:

- Works with `flowbite` v3.1.2 (currently used in project)
- Works with `tailwindcss` v3.3.0 (currently used in project)
- Works with `postcss` v8.5.3 (currently used in project)

## Advanced Features

### Collapsible Sidebar

The desktop sidebar can be collapsed to an icon-only view, saving space while maintaining navigation functionality.

### Mobile Navigation

On smaller screens, the sidebar is replaced with a hamburger menu that opens an off-canvas navigation panel.

### React Router Integration

The component uses a LinkWrapper to maintain proper integration with React Router, enabling:

- Navigation through React Router instead of page reloads
- Active state highlighting based on current route
- Proper history management

## Usage

### Basic Setup

To use these components in your application:

1. Make sure you have the required dependencies installed:

```bash
npm install flowbite-react react-router-dom
```

2. Import the FlowbiteWithRouter component in your route configuration:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FlowbiteWithRouter from './components/FlowbiteWithRouter';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlowbiteWithRouter />}>
          <Route index element={<Dashboard />} />
          <Route path="auctions" element={<Auctions />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

### Mobile Sidebar

The MobileSidebar component can be used independently in other layouts:

```tsx
import MobileSidebar from './components/MobileSidebar';

function MyLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsMobileMenuOpen(true)}>
        Open Menu
      </button>
      
      <MobileSidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Rest of your layout */}
    </div>
  );
}
```

### Custom Hook

The useActiveRoute hook can be used in any component that needs to determine if a route is active:

```tsx
import useActiveRoute from '../hooks/useActiveRoute';

function MyNavLink({ to, children }) {
  const isActive = useActiveRoute(to);
  
  return (
    <Link 
      to={to}
      className={isActive ? 'text-blue-600 font-bold' : 'text-gray-600'}
    >
      {children}
    </Link>
  );
}
```

## Compatibility Considerations

When working with flowbite-react 0.5.0:

1. We use the `LinkWrapper` component to properly integrate React Router's Link with Flowbite components
2. We maintain proper TypeScript types for all components and props
3. We use standard Flowbite components while ensuring they're available in version 0.5.0

For more information, refer to the [Flowbite React documentation](https://www.flowbite-react.com/docs/getting-started/introduction).

# Flowbite React Components

## FlowbiteWithRouter Component

The `FlowbiteWithRouter` component demonstrates integration between Flowbite React components and React Router. It's been simplified to ensure compatibility with the current version of flowbite-react.

### Features

- Navigation sidebar with active route highlighting
- Responsive navbar
- Content area with Outlet for nested routes
- Simplified design that works with flowbite-react v0.5.0

### Usage

```tsx
import FlowbiteWithRouter from './components/FlowbiteWithRouter';

// Inside your Routes
<Route path="/" element={<FlowbiteWithRouter />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="auctions" element={<Auctions />} />
  {/* Additional routes */}
</Route>
```

## Known Issues

1. The flowbite-react v0.5.0 has limited TypeScript type definitions
2. Some newer Flowbite components might not be available in this version
3. Custom themes may require specific adaptations for this version

## Upgrade Considerations

To upgrade to newer versions of flowbite-react:

1. Update the package.json dependencies for flowbite-react, tailwindcss, and postcss
2. Check for breaking changes in the component APIs
3. Update component usage according to the new API

For more information, refer to the [Flowbite React documentation](https://www.flowbite-react.com/docs/getting-started/introduction). 