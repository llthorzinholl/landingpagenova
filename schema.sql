-- Criação da tabela para armazenar mensagens do FloatingAssistant
CREATE TABLE IF NOT EXISTS assistant_messages (
    id SERIAL PRIMARY KEY,
    user_message TEXT NOT NULL,
    assistant_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);