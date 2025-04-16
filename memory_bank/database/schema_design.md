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
## Authentication and Security

### RefreshTokens
- id (PK)
- user_id (FK)
- token_hash
- expires_at
- device_info
- ip_address
- is_revoked
- created_at
- updated_at

### MFABackupCodes
- id (PK)
- user_id (FK)
- code_hash
- is_used
- created_at
- updated_at

### UserPermissions
- id (PK)
- user_id (FK)
- permission_name
- resource_type
- resource_id
- created_at
- updated_at

### AuthAuditLogs
- id (PK)
- user_id (FK)
- event_type (enum: login, logout, password_change, token_refresh, etc.)
- ip_address
- device_info
- success
- details_json
- created_at
## User Experience

### Watchlists
- id (PK)
- user_id (FK)
- name
- created_at
- updated_at

### WatchlistItems
- id (PK)
- watchlist_id (FK)
- certificate_id (FK)
- notes
- created_at
- updated_at

### Notifications
- id (PK)
- user_id (FK)
- type (enum: auction_start, outbid, certificate_status, etc.)
- title
- message
- is_read
- related_entity_type
- related_entity_id
- created_at
- updated_at

### NotificationPreferences
- id (PK)
- user_id (FK)
- notification_type
- enabled
- channel (enum: email, sms, in_app, push)
- created_at
- updated_at

### UserSearchHistory
- id (PK)
- user_id (FK)
- query_text
- filter_params_json
- results_count
- created_at

### SavedSearches
- id (PK)
- user_id (FK)
- name
- query_text
- filter_params_json
- created_at
- updated_at
## Document Management

### Documents
- id (PK)
- entity_type (enum: certificate, property, user, etc.)
- entity_id
- document_type
- file_name
- file_path
- file_size
- mime_type
- is_public
- created_by
- created_at
- updated_at

### CertificateHistory
- id (PK)
- certificate_id (FK)
- event_type
- change_data_json
- performed_by
- created_at
## Portfolio Management

### Portfolios
- id (PK)
- user_id (FK)
- name
- description
- created_at
- updated_at

### PortfolioCertificates
- id (PK)
- portfolio_id (FK)
- certificate_id (FK)
- added_at

### PortfolioTags
- id (PK)
- portfolio_id (FK)
- name
- color
- created_at
- updated_at

### CertificateTags
- id (PK)
- certificate_id (FK)
- tag_id (FK)
- created_at
## Financial Management

### Deposits
- id (PK)
- user_id (FK)
- amount
- payment_id (FK)
- status
- created_at
- updated_at

### Redemptions
- id (PK)
- certificate_id (FK)
- amount
- interest_amount
- redeemer_info_json
- payment_id (FK)
- status
- created_at
- updated_at

### Transactions
- id (PK)
- user_id (FK)
- transaction_type
- amount
- reference_type
- reference_id
- details_json
- created_at
## Audit and Compliance

### AuditLogs
- id (PK)
- user_id (FK)
- entity_type
- entity_id
- action
- changes_json
- ip_address
- created_at

### ComplianceVerifications
- id (PK)
- user_id (FK)
- verification_type
- status
- verification_data_json
- verified_by
- verified_at
- expires_at
- created_at
- updated_at
## Reporting and Analytics

### ReportConfigurations
- id (PK)
- user_id (FK)
- name
- report_type
- parameters_json
- schedule_json
- created_at
- updated_at

### ReportExecutions
- id (PK)
- configuration_id (FK)
- status
- result_file_path
- execution_time
- error_message
- created_at
- updated_at
## Advanced Features

### PropertyValueHistory
- id (PK)
- property_id (FK)
- assessed_value
- valuation_date
- source
- created_at

### MarketAnalytics
- id (PK)
- county_id (FK)
- metric_type
- time_period
- value
- calculation_data_json
- created_at

### BidPatterns
- id (PK)
- user_id (FK)
- pattern_type
- parameters_json
- created_at
- updated_at

### AutoBidConfigurations
- id (PK)
- user_id (FK)
- name
- enabled
- parameters_json
- created_at
- updated_at

### AutoBidTargets
- id (PK)
- configuration_id (FK)
- certificate_id (FK)
- max_interest_rate
- created_at
- updated_at
