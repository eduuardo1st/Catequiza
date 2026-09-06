-- V1: Schema inicial do Catequiza (Shared Database Pattern)
-- Responsavel: backend-admin (unico servico autorizado a migrar via Flyway)

CREATE TABLE turma (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL
);

CREATE TABLE catequizando (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    turma_id BIGINT NOT NULL,
    CONSTRAINT fk_catequizando_turma FOREIGN KEY (turma_id) REFERENCES turma(id)
);

CREATE TABLE presenca (
    id BIGSERIAL PRIMARY KEY,
    catequizando_id BIGINT NOT NULL,
    data_aula DATE NOT NULL,
    presente BOOLEAN NOT NULL,
    CONSTRAINT fk_presenca_catequizando FOREIGN KEY (catequizando_id) REFERENCES catequizando(id),
    CONSTRAINT uq_presenca_catequizando_data UNIQUE (catequizando_id, data_aula)
);