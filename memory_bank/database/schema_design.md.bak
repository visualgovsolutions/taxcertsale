# Database Schema Design

## Core Entities

### Users
- id (PK)
- email
- password_hash
- role (enum: admin, county_admin, investor, viewer)
- first_name
- last_name
- phone
- mfa_enabled
- status
- created_at
- updated_at

### Counties
- id (PK)
- name
- state
- contact_info
- settings_json
- created_at
- updated_at

### Properties
- id (PK)
- county_id (FK)
- parcel_id
- owner_name
- address
- city
- state
- zip
- property_type
- assessed_value
- coordinates
- created_at
- updated_at

### Certificates
- id (PK)
- property_id (FK)
- certificate_number
- tax_year
- face_value
- status (enum: pending, active, sold, redeemed, canceled)
- issue_date
- redemption_date
- created_at
- updated_at

### Auctions
- id (PK)
- county_id (FK)
- name
- start_date
- end_date
- status
- settings_json
- created_at
- updated_at

### Batches
- id (PK)
- auction_id (FK)
- name
- start_time
- end_time
- status
- created_at
- updated_at

### BatchCertificates
- id (PK)
- batch_id (FK)
- certificate_id (FK)
- status
- created_at
- updated_at

### Bids
- id (PK)
- user_id (FK)
- certificate_id (FK)
- auction_id (FK)
- interest_rate
- timestamp
- status
- ip_address
- device_info
- created_at
- updated_at

### Payments
- id (PK)
- user_id (FK)
- amount
- payment_method
- transaction_id
- status
- details_json
- created_at
- updated_at

### WinningBids
- id (PK)
- user_id (FK)
- certificate_id (FK)
- bid_id (FK)
- interest_rate
- payment_status
- created_at
- updated_at
