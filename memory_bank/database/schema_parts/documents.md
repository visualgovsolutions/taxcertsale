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
