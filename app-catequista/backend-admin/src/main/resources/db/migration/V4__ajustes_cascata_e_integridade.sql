ALTER TABLE matricula_turma
    DROP CONSTRAINT IF EXISTS fk_matricula_catequizando,
    ADD CONSTRAINT fk_matricula_catequizando
        FOREIGN KEY (catequizando_matricula) REFERENCES catequizando(matricula) ON DELETE CASCADE;

ALTER TABLE matricula_turma
    DROP CONSTRAINT IF EXISTS fk_matricula_turma,
    ADD CONSTRAINT fk_matricula_turma
        FOREIGN KEY (turma_id) REFERENCES turma(id) ON DELETE CASCADE;

ALTER TABLE aula
    DROP CONSTRAINT IF EXISTS fk_aula_turma,
    ADD CONSTRAINT fk_aula_turma
        FOREIGN KEY (turma_id) REFERENCES turma(id) ON DELETE CASCADE;

ALTER TABLE chamada
    DROP CONSTRAINT IF EXISTS fk_chamada_aula,
    ADD CONSTRAINT fk_chamada_aula
        FOREIGN KEY (aula_id) REFERENCES aula(id) ON DELETE CASCADE;

ALTER TABLE chamada
    DROP CONSTRAINT IF EXISTS fk_chamada_catequizando,
    ADD CONSTRAINT fk_chamada_catequizando
        FOREIGN KEY (catequizando_matricula) REFERENCES catequizando(matricula) ON DELETE CASCADE;

ALTER TABLE fila_espera
    DROP CONSTRAINT IF EXISTS fk_fila_catequizando,
    ADD CONSTRAINT fk_fila_catequizando
        FOREIGN KEY (catequizando_matricula) REFERENCES catequizando(matricula) ON DELETE CASCADE;

INSERT INTO aula (turma_id, data, pin, horario_expiracao, descricao_conteudo)
SELECT t.id, a.data, a.pin, a.horario_expiracao, a.descricao_conteudo
FROM (VALUES
    ('1ª Eucaristia - Turma São Pedro (Sáb 09h)', DATE '2026-09-19', 'EUC091', TIMESTAMP '2026-09-19 13:00:00', 'A Criação e a Aliança de Deus com o Seu Povo'),
    ('1ª Eucaristia - Turma São Pedro (Sáb 09h)', DATE '2026-09-26', 'EUC092', TIMESTAMP '2026-09-26 13:00:00', 'Os Dez Mandamentos: Caminho de Liberdade e Amor'),
    ('1ª Eucaristia - Turma São Pedro (Sáb 09h)', DATE '2026-10-03', 'EUC093', TIMESTAMP '2026-10-03 13:00:00', 'As Bem-Aventuranças e o Sermão da Montanha'),
    ('1ª Eucaristia - Turma São Pedro (Sáb 09h)', DATE '2026-10-31', 'EUC105', TIMESTAMP '2026-10-31 13:00:00', 'O Sacramento da Reconciliação e o Exame de Consciência'),
    ('1ª Eucaristia - Turma São Pedro (Sáb 09h)', DATE '2026-11-07', 'EUC106', TIMESTAMP '2026-11-07 13:00:00', 'A Santa Missa: Liturgia da Palavra e Liturgia Eucarística')
) AS a(nome_turma, data, pin, horario_expiracao, descricao_conteudo)
JOIN turma t ON t.nome_turma = a.nome_turma
WHERE NOT EXISTS (SELECT 1 FROM aula ex WHERE ex.pin = a.pin);

INSERT INTO chamada (aula_id, catequizando_matricula, presente)
SELECT a.id, c.matricula, ch.presente
FROM (VALUES
    ('EUC091', '111.222.333-44', TRUE),
    ('EUC091', '222.333.444-55', TRUE),
    ('EUC091', '333.444.555-66', FALSE),
    ('EUC091', '666.777.888-99', FALSE),
    ('EUC091', '777.888.999-00', TRUE),
    ('EUC091', '888.999.000-11', TRUE),
    ('EUC092', '111.222.333-44', TRUE),
    ('EUC092', '222.333.444-55', TRUE),
    ('EUC092', '333.444.555-66', FALSE),
    ('EUC092', '666.777.888-99', FALSE),
    ('EUC092', '777.888.999-00', TRUE),
    ('EUC092', '888.999.000-11', TRUE),
    ('EUC093', '111.222.333-44', TRUE),
    ('EUC093', '222.333.444-55', TRUE),
    ('EUC093', '333.444.555-66', FALSE),
    ('EUC093', '666.777.888-99', TRUE),
    ('EUC093', '777.888.999-00', TRUE),
    ('EUC093', '888.999.000-11', TRUE),
    ('EUC105', '111.222.333-44', TRUE),
    ('EUC105', '222.333.444-55', TRUE),
    ('EUC105', '333.444.555-66', FALSE),
    ('EUC105', '666.777.888-99', TRUE),
    ('EUC105', '777.888.999-00', FALSE),
    ('EUC105', '888.999.000-11', TRUE),
    ('EUC106', '111.222.333-44', TRUE),
    ('EUC106', '222.333.444-55', TRUE),
    ('EUC106', '333.444.555-66', TRUE),
    ('EUC106', '666.777.888-99', TRUE),
    ('EUC106', '777.888.999-00', FALSE),
    ('EUC106', '888.999.000-11', TRUE),
    ('EUC401', '333.444.555-66', FALSE),
    ('EUC401', '888.999.000-11', TRUE)
) AS ch(pin_aula, cpf, presente)
JOIN aula a ON a.pin = ch.pin_aula
JOIN catequizando c ON c.cpf = ch.cpf
ON CONFLICT (aula_id, catequizando_matricula) DO NOTHING;
