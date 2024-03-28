CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS user_storage_table (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(50) DEFAULT 'User',
    profile_pic VARCHAR(255) DEFAULT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saved_notes_ids TEXT[] DEFAULT ARRAY[]::TEXT[]
);

INSERT INTO user_storage_table (user_id, username, email, first_name, last_name, role, profile_pic, is_paid)
VALUES ('536217b2-17c7-4e84-880a-4cba12a4eabd', 'johndoe', 'john.doe@example.com', 'John', 'Doe', 'User', NULL, FALSE);

