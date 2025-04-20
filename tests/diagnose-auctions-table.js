const { TestDataSource } = require('./test-utils/test-data-source');

(async () => {
  try {
    await TestDataSource.initialize();
    const queryRunner = TestDataSource.createQueryRunner();
    await queryRunner.connect();
    const dbInfo = await queryRunner.query('SELECT current_database() as db');
    const auctionColumns = await queryRunner.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'auctions'`);
    console.log('TEST DB:', dbInfo[0].db);
    console.log('AUCTIONS TABLE COLUMNS:', auctionColumns.map(c => c.column_name));
    await queryRunner.release();
    await TestDataSource.destroy();
  } catch (err) {
    console.error('Error during diagnosis:', err);
    process.exit(1);
  }
})(); 