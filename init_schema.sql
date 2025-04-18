-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'county_admin', 'investor', 'viewer')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Certificate Batches Table
CREATE TABLE certificate_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'active', 'closed', 'canceled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_certificate_batches_status_start_time ON certificate_batches(status, start_time);
CREATE INDEX idx_certificate_batches_status_end_time ON certificate_batches(status, end_time);

-- Certificates Table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(255) UNIQUE NOT NULL,
    county_id VARCHAR(255) NOT NULL, 
    parcel_id VARCHAR(255) NOT NULL,
    face_value NUMERIC(12, 2) NOT NULL, 
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'available', 'auction_scheduled', 'auction_active', 'auction_closed', 'sold', 'redeemed', 'expired')),
    interest_rate NUMERIC(5, 2), 
    purchaser_id UUID REFERENCES users(id),
    purchase_date TIMESTAMPTZ,
    redemption_date TIMESTAMPTZ,
    expiration_date TIMESTAMPTZ,
    batch_id UUID REFERENCES certificate_batches(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_batch_id ON certificates(batch_id);
CREATE INDEX idx_certificates_purchaser_id ON certificates(purchaser_id);

-- Bids Table
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    certificate_id UUID NOT NULL REFERENCES certificates(id),
    interest_rate NUMERIC(5, 2) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'outbid', 'winning')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_bids_certificate_id_status ON bids(certificate_id, status);
CREATE INDEX idx_bids_user_id ON bids(user_id);

-- Function to update updated_at column automatically
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the function as a trigger to relevant tables
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_certificates
BEFORE UPDATE ON certificates
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_certificate_batches
BEFORE UPDATE ON certificate_batches
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_bids
BEFORE UPDATE ON bids
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp(); 