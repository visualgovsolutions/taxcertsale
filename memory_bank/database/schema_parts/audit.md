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
