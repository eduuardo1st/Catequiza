INSERT INTO catequista (nome, telefone, email, senha) VALUES
('Catequista Coordenador', '(11) 98888-0001', 'admin@paroquia.org', '$2a$10$Y50UaMFOxteibQEYLrwuHeehHYfcoafCopUazP12.rqB471MYCTHy'),
('Maria Helena Silva', '(11) 98888-0002', 'maria.silva@paroquia.org', '$2a$10$Y50UaMFOxteibQEYLrwuHeehHYfcoafCopUazP12.rqB471MYCTHy'),
('João Paulo Santos', '(11) 98888-0003', 'joao.paulo@paroquia.org', '$2a$10$Y50UaMFOxteibQEYLrwuHeehHYfcoafCopUazP12.rqB471MYCTHy'),
('Ana Clara Souza', '(11) 98888-0004', 'ana.clara@paroquia.org', '$2a$10$Y50UaMFOxteibQEYLrwuHeehHYfcoafCopUazP12.rqB471MYCTHy');

INSERT INTO turma (catequista_id, nome_turma, ano_letivo)
SELECT c.id, t.nome_turma, t.ano_letivo
FROM (VALUES
    ('admin@paroquia.org', '1ª Eucaristia - Turma São Pedro (Sáb 09h)', 2026),
    ('maria.silva@paroquia.org', '1ª Eucaristia - Turma São Paulo (Sáb 15h)', 2026),
    ('joao.paulo@paroquia.org', 'Crisma de Jovens - Turma Pentecostes (Dom 10h)', 2026),
    ('ana.clara@paroquia.org', 'Crisma de Adultos - Turma Santo Agostinho (Qua 19h30)', 2026),
    ('admin@paroquia.org', 'Batismo - Preparação de Pais e Padrinhos', 2026),
    ('maria.silva@paroquia.org', 'Perseverança - Turma São Francisco (Sáb 10h30)', 2026),
    ('joao.paulo@paroquia.org', '1ª Eucaristia - Turma São João (Ciclo 2025 Concluído)', 2025),
    ('ana.clara@paroquia.org', 'Crisma - Turma Santa Teresinha (Ciclo 2025 Concluído)', 2025)
) AS t(email, nome_turma, ano_letivo)
JOIN catequista c ON c.email = t.email;

INSERT INTO catequizando (cpf, nome, telefone, email) VALUES
('666.777.888-99', 'Sofia Alves Martins', '(11) 97111-2233', 'sofia.martins@email.com'),
('777.888.999-00', 'Enzo Gabriel Ribeiro', '(11) 97222-3344', 'enzo.ribeiro@email.com'),
('888.999.000-11', 'Helena Castro Barbosa', '(11) 97333-4455', 'helena.barbosa@email.com'),
('999.000.111-22', 'Davi Lucca Almeida', '(11) 97444-5566', 'davi.almeida@email.com'),
('012.345.678-90', 'Manuela Gomes Cardoso', '(11) 97555-6677', 'manuela.cardoso@email.com'),
('123.789.456-01', 'Bernardo Vieira Rocha', '(11) 97666-7788', 'bernardo.rocha@email.com'),
('234.890.567-12', 'Valentina Dias Moreira', '(11) 97777-8899', 'valentina.moreira@email.com'),
('345.901.678-23', 'Pedro Henrique Ramos', '(11) 97888-9900', 'pedro.ramos@email.com'),
('456.012.789-34', 'Laura Nogueira Teixeira', '(11) 97999-0011', 'laura.teixeira@email.com'),
('567.123.890-45', 'Arthur Cavalcanti Farias', '(11) 98111-1122', 'arthur.farias@email.com'),
('678.234.901-56', 'Isabella Moura Guimarães', '(11) 98222-2233', 'isabella.guimaraes@email.com'),
('789.345.012-67', 'Lorenzo Correia Duarte', '(11) 98333-3344', 'lorenzo.duarte@email.com'),
('890.456.123-78', 'Alice Freitas Carvalho', '(11) 98444-4455', 'alice.carvalho@email.com'),
('901.567.234-89', 'Miguel Arcanjo Borges', '(11) 98555-5566', 'miguel.borges@email.com'),
('019.283.746-50', 'Cecília Monteiro Pires', '(11) 98666-6677', 'cecilia.pires@email.com');

INSERT INTO matricula_turma (catequizando_matricula, turma_id, status_matricula)
SELECT c.matricula, t.id, m.status_matricula
FROM (VALUES
    ('111.222.333-44', '1ª Eucaristia - Turma São Pedro (Sáb 09h)', 'ATIVA'),
    ('222.333.444-55', '1ª Eucaristia - Turma São Pedro (Sáb 09h)', 'ATIVA'),
    ('333.444.555-66', '1ª Eucaristia - Turma São Pedro (Sáb 09h)', 'ATIVA'),
    ('666.777.888-99', '1ª Eucaristia - Turma São Pedro (Sáb 09h)', 'ATIVA'),
    ('777.888.999-00', '1ª Eucaristia - Turma São Pedro (Sáb 09h)', 'ATIVA'),
    ('888.999.000-11', '1ª Eucaristia - Turma São Pedro (Sáb 09h)', 'ATIVA'),
    ('444.555.666-77', '1ª Eucaristia - Turma São Paulo (Sáb 15h)', 'ATIVA'),
    ('999.000.111-22', '1ª Eucaristia - Turma São Paulo (Sáb 15h)', 'ATIVA'),
    ('012.345.678-90', '1ª Eucaristia - Turma São Paulo (Sáb 15h)', 'ATIVA'),
    ('123.789.456-01', '1ª Eucaristia - Turma São Paulo (Sáb 15h)', 'ATIVA'),
    ('555.666.777-88', 'Crisma de Jovens - Turma Pentecostes (Dom 10h)', 'ATIVA'),
    ('234.890.567-12', 'Crisma de Jovens - Turma Pentecostes (Dom 10h)', 'ATIVA'),
    ('345.901.678-23', 'Crisma de Jovens - Turma Pentecostes (Dom 10h)', 'ATIVA'),
    ('456.012.789-34', 'Crisma de Jovens - Turma Pentecostes (Dom 10h)', 'ATIVA'),
    ('567.123.890-45', 'Crisma de Adultos - Turma Santo Agostinho (Qua 19h30)', 'ATIVA'),
    ('678.234.901-56', 'Crisma de Adultos - Turma Santo Agostinho (Qua 19h30)', 'ATIVA'),
    ('789.345.012-67', 'Perseverança - Turma São Francisco (Sáb 10h30)', 'ATIVA'),
    ('890.456.123-78', 'Perseverança - Turma São Francisco (Sáb 10h30)', 'ATIVA'),
    ('111.222.333-44', '1ª Eucaristia - Turma São João (Ciclo 2025 Concluído)', 'CONCLUIDA'),
    ('222.333.444-55', '1ª Eucaristia - Turma São João (Ciclo 2025 Concluído)', 'CONCLUIDA'),
    ('901.567.234-89', '1ª Eucaristia - Turma São João (Ciclo 2025 Concluído)', 'CONCLUIDA'),
    ('019.283.746-50', 'Crisma - Turma Santa Teresinha (Ciclo 2025 Concluído)', 'CONCLUIDA')
) AS m(cpf, nome_turma, status_matricula)
JOIN catequizando c ON c.cpf = m.cpf
JOIN turma t ON t.nome_turma = m.nome_turma;

INSERT INTO aula (turma_id, data, pin, horario_expiracao, descricao_conteudo)
SELECT t.id, a.data, a.pin, a.horario_expiracao, a.descricao_conteudo
FROM (VALUES
    ('1ª Eucaristia - Turma São Pedro (Sáb 09h)', DATE '2026-10-10', 'EUC101', TIMESTAMP '2026-10-10 13:00:00', 'Introdução à Bíblia e à História da Salvação'),
    ('1ª Eucaristia - Turma São Pedro (Sáb 09h)', DATE '2026-10-17', 'EUC102', TIMESTAMP '2026-10-17 13:00:00', 'Os Sete Sacramentos da Igreja Católica'),
    ('1ª Eucaristia - Turma São Pedro (Sáb 09h)', DATE '2026-10-24', 'EUC401', TIMESTAMP '2026-10-26 23:59:59', 'A Oração do Pai Nosso e a Vida Comunitária'),
    ('1ª Eucaristia - Turma São Paulo (Sáb 15h)', DATE '2026-10-17', 'EUC201', TIMESTAMP '2026-10-17 19:00:00', 'Jesus Cristo: Vida, Milagres e Ensinamentos'),
    ('1ª Eucaristia - Turma São Paulo (Sáb 15h)', DATE '2026-10-24', 'EUC402', TIMESTAMP '2026-10-26 23:59:59', 'O Santo Sacrifício da Missa e a Sagrada Comunhão'),
    ('Crisma de Jovens - Turma Pentecostes (Dom 10h)', DATE '2026-10-11', 'CRI101', TIMESTAMP '2026-10-11 14:00:00', 'O Batismo e a Confirmação: Selados pelo Espírito Santo'),
    ('Crisma de Jovens - Turma Pentecostes (Dom 10h)', DATE '2026-10-25', 'CRI501', TIMESTAMP '2026-10-26 23:59:59', 'Os 7 Dons do Espírito Santo e a Missão do Cristão no Mundo'),
    ('Crisma de Adultos - Turma Santo Agostinho (Qua 19h30)', DATE '2026-10-21', 'ADU101', TIMESTAMP '2026-10-21 23:30:00', 'O Credo Apostólico e a Tradição Viva da Fé')
) AS a(nome_turma, data, pin, horario_expiracao, descricao_conteudo)
JOIN turma t ON t.nome_turma = a.nome_turma;

INSERT INTO chamada (aula_id, catequizando_matricula, presente)
SELECT a.id, c.matricula, ch.presente
FROM (VALUES
    ('EUC101', '111.222.333-44', TRUE),
    ('EUC101', '222.333.444-55', TRUE),
    ('EUC101', '333.444.555-66', FALSE),
    ('EUC101', '666.777.888-99', TRUE),
    ('EUC101', '777.888.999-00', TRUE),
    ('EUC101', '888.999.000-11', TRUE),
    ('EUC102', '111.222.333-44', TRUE),
    ('EUC102', '222.333.444-55', TRUE),
    ('EUC102', '333.444.555-66', TRUE),
    ('EUC102', '666.777.888-99', FALSE),
    ('EUC102', '777.888.999-00', TRUE),
    ('EUC102', '888.999.000-11', TRUE),
    ('EUC401', '111.222.333-44', TRUE),
    ('EUC401', '222.333.444-55', TRUE),
    ('EUC401', '666.777.888-99', TRUE),
    ('EUC401', '777.888.999-00', FALSE),
    ('EUC201', '444.555.666-77', TRUE),
    ('EUC201', '999.000.111-22', TRUE),
    ('EUC201', '012.345.678-90', FALSE),
    ('EUC201', '123.789.456-01', TRUE),
    ('EUC402', '444.555.666-77', TRUE),
    ('EUC402', '999.000.111-22', TRUE),
    ('CRI101', '555.666.777-88', TRUE),
    ('CRI101', '234.890.567-12', TRUE),
    ('CRI101', '345.901.678-23', FALSE),
    ('CRI101', '456.012.789-34', TRUE),
    ('CRI501', '555.666.777-88', TRUE),
    ('CRI501', '234.890.567-12', TRUE),
    ('CRI501', '345.901.678-23', TRUE),
    ('ADU101', '567.123.890-45', TRUE),
    ('ADU101', '678.234.901-56', TRUE)
) AS ch(pin_aula, cpf, presente)
JOIN aula a ON a.pin = ch.pin_aula
JOIN catequizando c ON c.cpf = ch.cpf;

INSERT INTO fila_espera (catequizando_matricula, sacramento_desejado, data_solicitacao, status)
SELECT c.matricula, f.sacramento_desejado, f.data_solicitacao, f.status
FROM (VALUES
    ('999.000.111-22', 'Batismo', DATE '2026-09-15', 'PENDENTE'),
    ('012.345.678-90', '1ª Eucaristia', DATE '2026-09-20', 'CHAMADO'),
    ('456.012.789-34', 'Crisma', DATE '2026-09-25', 'MATRICULADO'),
    ('567.123.890-45', 'Crisma', DATE '2026-10-01', 'PENDENTE'),
    ('890.456.123-78', 'Perseverança', DATE '2026-10-05', 'PENDENTE'),
    ('901.567.234-89', '1ª Eucaristia', DATE '2026-09-10', 'CANCELADO'),
    ('019.283.746-50', 'Crisma', DATE '2026-10-18', 'PENDENTE')
) AS f(cpf, sacramento_desejado, data_solicitacao, status)
JOIN catequizando c ON c.cpf = f.cpf;
