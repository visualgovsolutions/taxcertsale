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
