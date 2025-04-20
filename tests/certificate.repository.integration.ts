import { v4 as uuidv4 } from 'uuid';
import { CertificateStatus } from '../src/models/enums/certificate-status.enum';
import { AuctionStatus } from '../src/models/enums/auction-status.enum';
import { TestDataSource } from './test-utils/test-data-source';

(async () => {
  try {
    await TestDataSource.initialize();
    const queryRunner = TestDataSource.createQueryRunner();
    await queryRunner.connect();

    // Print DB and columns
    const dbInfo = await queryRunner.query('SELECT current_database() as db');
    const auctionColumns = await queryRunner.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'auctions'`);
    console.log('TEST DB:', dbInfo[0].db);
    console.log('AUCTIONS TABLE COLUMNS:', auctionColumns.map((c: any) => c.column_name));

    // Generate unique test data IDs
    const countyId = uuidv4();
    const propertyId = uuidv4();
    const auctionId = uuidv4();
    const certificateId = uuidv4();
    const testPrefix = uuidv4().substring(0, 8);

    // 1. Create a county
    await queryRunner.query(`
      INSERT INTO counties (id, name, state, createdat, updatedat)
      VALUES ($1, $2, 'FL', NOW(), NOW())
    `, [countyId, `Test County ${testPrefix}`]);

    // 2. Create a property
    await queryRunner.query(`
      INSERT INTO properties (id, parcelid, address, city, zipcode, countyid, createdat, updatedat)
      VALUES ($1, $2, '123 Test St', 'Test City', '12345', $3, NOW(), NOW())
    `, [propertyId, `P-${testPrefix}`, countyId]);

    // 3. Create an auction
    await queryRunner.query(`
      INSERT INTO auctions (id, name, auctiondate, starttime, endtime, status, countyid, createdat, updatedat)
      VALUES ($1, $2, NOW(), '09:00:00', '17:00:00', $3, $4, NOW(), NOW())
    `, [auctionId, `Auction ${testPrefix}`, AuctionStatus.ACTIVE, countyId]);

    // 4. Create a certificate
    await queryRunner.query(`
      INSERT INTO certificates (id, certificatenumber, facevalue, interestrate, 
                              issuedate, status, countyid, propertyid, auctionid, 
                              createdat, updatedat)
      VALUES ($1, $2, 1500.50, 18.0, NOW(), $3, $4, $5, $6, NOW(), NOW())
    `, [certificateId, `CERT-${testPrefix}`, CertificateStatus.AVAILABLE, 
        countyId, propertyId, auctionId]);

    // Verify certificate exists
    const certResult = await queryRunner.query(
      `SELECT * FROM certificates WHERE id = $1`, [certificateId]
    );
    if (certResult.length !== 1 || certResult[0].certificatenumber !== `CERT-${testPrefix}`) {
      throw new Error('Certificate creation verification failed');
    }
    console.log('Certificate created and verified.');

    // Update certificate
    await queryRunner.query(`
      UPDATE certificates 
      SET facevalue = 2000.0, status = $1, updatedat = NOW()
      WHERE id = $2
    `, [CertificateStatus.SOLD, certificateId]);

    // Verify update
    const updatedResult = await queryRunner.query(
      `SELECT * FROM certificates WHERE id = $1`, [certificateId]
    );
    if (updatedResult.length !== 1 || Number(updatedResult[0].facevalue) !== 2000.0 || updatedResult[0].status !== CertificateStatus.SOLD) {
      throw new Error('Certificate update verification failed');
    }
    console.log('Certificate updated and verified.');

    // Delete certificate
    await queryRunner.query(`DELETE FROM certificates WHERE id = $1`, [certificateId]);

    // Verify deletion
    const deletedResult = await queryRunner.query(
      `SELECT * FROM certificates WHERE id = $1`, [certificateId]
    );
    if (deletedResult.length !== 0) {
      throw new Error('Certificate deletion verification failed');
    }
    console.log('Certificate deleted and verified.');

    await queryRunner.release();
    await TestDataSource.destroy();
    console.log('Integration test completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Integration test failed:', err);
    process.exit(1);
  }
})(); 