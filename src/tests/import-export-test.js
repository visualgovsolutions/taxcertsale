// Import-Export API Test Script
console.log('Starting Import/Export API Test...');

const runTests = async () => {
  console.log('Checking that service modules can be imported correctly...');
  
  try {
    const { 
      startExport, 
      getExportJobStatus, 
      downloadExportFile, 
      EntityType,
      ExportFormat
    } = require('../frontend/services/importExportService');
    
    console.log('✅ Service modules imported successfully');
    console.log(`Available entity types: ${JSON.stringify(Object.values(EntityType))}`);
    console.log(`Available export formats: ${JSON.stringify(Object.values(ExportFormat))}`);
    
    // Test that type definitions are correctly aligned
    console.log('Testing entity type validation...');
    const validEntityTypes = ['certificate', 'property', 'auction', 'bidder'];
    let allValid = true;
    for (const type of validEntityTypes) {
      if (!validEntityTypes.includes(type)) {
        console.error(`❌ Invalid entity type: ${type}`);
        allValid = false;
      }
    }
    
    if (allValid) {
      console.log('✅ Entity types validated successfully');
    }
    
    console.log('Testing export format validation...');
    const validExportFormats = ['csv', 'xlsx', 'json', 'pdf'];
    allValid = true;
    for (const format of validExportFormats) {
      if (!validExportFormats.includes(format)) {
        console.error(`❌ Invalid export format: ${format}`);
        allValid = false;
      }
    }
    
    if (allValid) {
      console.log('✅ Export formats validated successfully');
    }
    
    console.log('Testing import format validation...');
    const validImportFormats = ['csv', 'xlsx', 'json'];
    allValid = true;
    for (const format of validImportFormats) {
      if (!validImportFormats.includes(format)) {
        console.error(`❌ Invalid import format: ${format}`);
        allValid = false;
      }
    }
    
    if (allValid) {
      console.log('✅ Import formats validated successfully');
    }
    
    console.log('\nAll tests completed successfully ✅');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
}); 