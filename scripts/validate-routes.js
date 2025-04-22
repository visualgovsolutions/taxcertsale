#!/usr/bin/env node

/**
 * validate-routes.js
 * 
 * This script validates that all admin routes in the sidebar links
 * have corresponding routes defined in App.tsx.
 * 
 * It also checks for any duplicate route definitions between App.tsx and AppRouter.tsx.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Paths to relevant files
const APP_ROUTER_PATH = path.join(__dirname, '../src/frontend/App.tsx');
const ALTERNATE_ROUTER_PATH = path.join(__dirname, '../src/frontend/AppRouter.tsx');
const ADMIN_LAYOUT_PATH = path.join(__dirname, '../src/frontend/components/admin/AdminLayout.tsx');

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

/**
 * Extract route paths from App.tsx
 */
function extractAppRoutes() {
  const appContent = fs.readFileSync(APP_ROUTER_PATH, 'utf8');
  
  // Look for admin routes like: <Route path="dashboard" element={<AdminDashboardPage />} />
  const adminRoutePattern = /<Route\s+path=["']([^"']+)["']\s+element=\{<Admin([^>]+)\/>/g;
  const adminIndexPattern = /<Route\s+index\s+element=\{<Navigate\s+to=["']([^"']+)["']\s+replace/g;
  
  const appRoutes = new Set();
  let match;
  
  // Extract regular routes
  while ((match = adminRoutePattern.exec(appContent)) !== null) {
    appRoutes.add(`/admin/${match[1]}`);
  }
  
  // Extract index redirects
  while ((match = adminIndexPattern.exec(appContent)) !== null) {
    appRoutes.add(`/admin/${match[1]}`);
  }
  
  return appRoutes;
}

/**
 * Extract routes from AppRouter.tsx if it exists
 */
function extractAlternateRoutes() {
  if (!fs.existsSync(ALTERNATE_ROUTER_PATH)) {
    return new Set();
  }
  
  const routerContent = fs.readFileSync(ALTERNATE_ROUTER_PATH, 'utf8');
  
  // Same patterns as before
  const adminRoutePattern = /<Route\s+path=["']([^"']+)["']\s+element=\{<Admin([^>]+)\/>/g;
  const adminIndexPattern = /<Route\s+index\s+element=\{<Navigate\s+to=["']([^"']+)["']\s+replace/g;
  
  const alternateRoutes = new Set();
  let match;
  
  while ((match = adminRoutePattern.exec(routerContent)) !== null) {
    alternateRoutes.add(`/admin/${match[1]}`);
  }
  
  while ((match = adminIndexPattern.exec(routerContent)) !== null) {
    alternateRoutes.add(`/admin/${match[1]}`);
  }
  
  return alternateRoutes;
}

/**
 * Extract sidebar links from AdminLayout.tsx
 */
function extractSidebarLinks() {
  const layoutContent = fs.readFileSync(ADMIN_LAYOUT_PATH, 'utf8');
  
  // Look for Link components with to="/admin/..."
  const linkPattern = /<Link\s+to=["']\/admin\/([^"']+)["']/g;
  
  const sidebarLinks = new Set();
  let match;
  
  while ((match = linkPattern.exec(layoutContent)) !== null) {
    sidebarLinks.add(`/admin/${match[1]}`);
  }
  
  return sidebarLinks;
}

/**
 * Find routes that are in the sidebar links but not in App.tsx
 */
function findMissingRoutes(sidebarLinks, appRoutes) {
  const missingRoutes = new Set();
  
  for (const link of sidebarLinks) {
    if (!appRoutes.has(link)) {
      missingRoutes.add(link);
    }
  }
  
  return missingRoutes;
}

/**
 * Find routes that are duplicated between App.tsx and AppRouter.tsx
 */
function findDuplicateRoutes(appRoutes, alternateRoutes) {
  const duplicates = new Set();
  
  for (const route of alternateRoutes) {
    if (appRoutes.has(route)) {
      duplicates.add(route);
    }
  }
  
  return duplicates;
}

/**
 * Add the script to package.json if it's not already there
 */
function addScriptToPackageJson() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts['validate-routes']) {
    packageJson.scripts['validate-routes'] = 'node ./scripts/validate-routes.js';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`${COLORS.green}✓ Added 'validate-routes' script to package.json${COLORS.reset}`);
  }
}

/**
 * Run the validation
 */
function runValidation() {
  console.log(`${COLORS.blue}🔍 Validating admin routes...${COLORS.reset}`);
  
  // Extract routes and links
  const appRoutes = extractAppRoutes();
  const alternateRoutes = extractAlternateRoutes();
  const sidebarLinks = extractSidebarLinks();
  
  console.log(`${COLORS.cyan}Found ${appRoutes.size} routes in App.tsx${COLORS.reset}`);
  console.log(`${COLORS.cyan}Found ${sidebarLinks.size} links in AdminLayout.tsx${COLORS.reset}`);
  
  if (alternateRoutes.size > 0) {
    console.log(`${COLORS.yellow}⚠️ Found ${alternateRoutes.size} routes in AppRouter.tsx (should be 0)${COLORS.reset}`);
  }
  
  // Find missing routes
  const missingRoutes = findMissingRoutes(sidebarLinks, appRoutes);
  
  if (missingRoutes.size > 0) {
    console.log(`${COLORS.red}❌ Missing routes in App.tsx for these sidebar links:${COLORS.reset}`);
    missingRoutes.forEach(route => {
      console.log(`${COLORS.red}   - ${route}${COLORS.reset}`);
    });
    console.log(`${COLORS.yellow}Add these routes to App.tsx to fix the issue.${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}✓ All sidebar links have corresponding routes in App.tsx${COLORS.reset}`);
  }
  
  // Find duplicate routes
  const duplicateRoutes = findDuplicateRoutes(appRoutes, alternateRoutes);
  
  if (duplicateRoutes.size > 0) {
    console.log(`${COLORS.red}❌ Found duplicate routes in both App.tsx and AppRouter.tsx:${COLORS.reset}`);
    duplicateRoutes.forEach(route => {
      console.log(`${COLORS.red}   - ${route}${COLORS.reset}`);
    });
    console.log(`${COLORS.yellow}You should consolidate all routes into App.tsx and eliminate AppRouter.tsx${COLORS.reset}`);
  } else if (alternateRoutes.size > 0) {
    console.log(`${COLORS.yellow}⚠️ AppRouter.tsx exists but no duplicate routes were found.${COLORS.reset}`);
    console.log(`${COLORS.yellow}Consider consolidating all routing in App.tsx for clarity.${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}✓ No duplicate route definitions found${COLORS.reset}`);
  }
  
  // Final result
  if (missingRoutes.size === 0 && duplicateRoutes.size === 0) {
    console.log(`${COLORS.green}✓ All routing validation checks passed!${COLORS.reset}`);
    return true;
  } else {
    console.log(`${COLORS.red}❌ Routing validation found issues that need to be fixed${COLORS.reset}`);
    return false;
  }
}

// Run the validation script
const success = runValidation();
try {
  addScriptToPackageJson();
} catch (err) {
  console.log(`${COLORS.yellow}⚠️ Could not update package.json: ${err.message}${COLORS.reset}`);
}

// Exit with appropriate code for CI integration
process.exit(success ? 0 : 1);
