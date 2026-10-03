CREATE TABLE identity_accounts (
    avito_user_id TEXT PRIMARY KEY,

    account_name TEXT NOT NULL,

    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,

    token_expires_at TIMESTAMP NOT NULL,

    subscription_status TEXT NOT NULL,
    subscription_until TIMESTAMP
);

CREATE TABLE worker_accounts (
    avito_user_id TEXT PRIMARY KEY,

    identity_account_id TEXT NOT NULL
        REFERENCES identity_accounts(avito_user_id),

    account_name TEXT NOT NULL,

    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,

    token_expires_at TIMESTAMP NOT NULL,

    status TEXT NOT NULL
);

CREATE TABLE listings (
    avito_listing_id TEXT PRIMARY KEY,

    worker_account_id TEXT NOT NULL
        REFERENCES worker_accounts(avito_user_id),

    title TEXT NOT NULL,

    price NUMERIC NOT NULL,

    image_url TEXT,

    status TEXT NOT NULL
);

CREATE TABLE publication_templates (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,

    selected_cities JSONB NOT NULL
);

CREATE TABLE variants (
    id TEXT PRIMARY KEY,

    template_id TEXT NOT NULL
        REFERENCES publication_templates(id),

    raw_listing_document JSONB NOT NULL,

    publication_count INTEGER NOT NULL
);

CREATE TABLE tasks (
    id TEXT PRIMARY KEY,

    identity_account_id TEXT NOT NULL
        REFERENCES identity_accounts(avito_user_id),

    publication_template_id TEXT
        REFERENCES publication_templates(id),

    update_template_id TEXT
        REFERENCES update_templates(id),

    task_type TEXT NOT NULL,

    status TEXT NOT NULL,

    progress INTEGER NOT NULL
);

CREATE TABLE update_templates (
    id TEXT PRIMARY KEY,

    identity_account_id TEXT NOT NULL
        REFERENCES identity_accounts(avito_user_id),

    text_settings JSONB,

    photo_settings JSONB
);


-- Relation tables for template entity associations.

-- Template ↔ WorkerAccount

CREATE TABLE publication_template_workers (
    template_id TEXT NOT NULL
        REFERENCES publication_templates(id) ON DELETE CASCADE,

    worker_account_id TEXT NOT NULL
        REFERENCES worker_accounts(avito_user_id) ON DELETE CASCADE,

    PRIMARY KEY (template_id, worker_account_id)
);

CREATE INDEX publication_template_workers_idx
    ON publication_template_workers(worker_account_id);


-- Template ↔ Listing

CREATE TABLE update_template_listings (
    template_id TEXT NOT NULL
        REFERENCES update_templates(id) ON DELETE CASCADE,

    listing_id TEXT NOT NULL
        REFERENCES listings(avito_listing_id) ON DELETE CASCADE,

    PRIMARY KEY (template_id, listing_id)
);

CREATE INDEX update_template_listings_idx
    ON update_template_listings(listing_id);