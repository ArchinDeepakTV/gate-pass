CREATE TABLE gate_pass_entries (
    id SERIAL PRIMARY KEY,
    serial_number INTEGER NOT NULL,
    person_name VARCHAR(255) NOT NULL,
    source VARCHAR(255),
    destination VARCHAR(255),
    reason TEXT,
    entry_date DATE NOT NULL,
    items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);