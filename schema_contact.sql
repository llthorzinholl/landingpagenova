-- Criação da tabela para armazenar envios do formulário de contato
CREATE TABLE IF NOT EXISTS landing_page_uploads (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT NOT NULL,
    service_type TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);