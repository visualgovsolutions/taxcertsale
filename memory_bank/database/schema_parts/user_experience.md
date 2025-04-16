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
