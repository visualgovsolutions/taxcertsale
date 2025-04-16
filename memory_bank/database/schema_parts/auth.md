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
