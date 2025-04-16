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
