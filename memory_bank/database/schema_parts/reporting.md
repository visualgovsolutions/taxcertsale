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
