CREATE TABLE catequista (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE turma (
    id BIGSERIAL PRIMARY KEY,
    catequista_id BIGINT NOT NULL,
    nome_turma VARCHAR(255) NOT NULL,
    ano_letivo INT NOT NULL,
    CONSTRAINT fk_turma_catequista FOREIGN KEY (catequista_id) REFERENCES catequista(id)
);

CREATE TABLE catequizando (
    matricula BIGSERIAL PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255)
);

CREATE TABLE matricula_turma (
    id BIGSERIAL PRIMARY KEY,
    catequizando_matricula BIGINT NOT NULL,
    turma_id BIGINT NOT NULL,
    status_matricula VARCHAR(50) NOT NULL,
    CONSTRAINT fk_matricula_catequizando FOREIGN KEY (catequizando_matricula) REFERENCES catequizando(matricula),
    CONSTRAINT fk_matricula_turma FOREIGN KEY (turma_id) REFERENCES turma(id)
);

CREATE TABLE aula (
    id BIGSERIAL PRIMARY KEY,
    turma_id BIGINT NOT NULL,
    data DATE NOT NULL,
    pin VARCHAR(10),
    horario_expiracao TIMESTAMP,
    descricao_conteudo TEXT,
    CONSTRAINT fk_aula_turma FOREIGN KEY (turma_id) REFERENCES turma(id)
);

CREATE TABLE chamada (
    id BIGSERIAL PRIMARY KEY,
    aula_id BIGINT NOT NULL,
    catequizando_matricula BIGINT NOT NULL,
    presente BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_chamada_aula FOREIGN KEY (aula_id) REFERENCES aula(id),
    CONSTRAINT fk_chamada_catequizando FOREIGN KEY (catequizando_matricula) REFERENCES catequizando(matricula),
    CONSTRAINT uq_chamada_aula_aluno UNIQUE (aula_id, catequizando_matricula)
);

CREATE TABLE fila_espera (
    id BIGSERIAL PRIMARY KEY,
    catequizando_matricula BIGINT NOT NULL,
    sacramento_desejado VARCHAR(100) NOT NULL,
    data_solicitacao DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_fila_catequizando FOREIGN KEY (catequizando_matricula) REFERENCES catequizando(matricula)
);