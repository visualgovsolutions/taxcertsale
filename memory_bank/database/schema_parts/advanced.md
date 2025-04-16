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
