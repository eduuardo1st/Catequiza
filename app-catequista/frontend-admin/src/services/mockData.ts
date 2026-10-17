import { Turma, Catequizando, FilaEsperaItem } from '../types';

export const INITIAL_TURMAS: Turma[] = [
  {
    id: 1,
    nomeTurma: "1ª EUCARISTIA - ETAPA 1 (SÁB 15H)",
    anoLetivo: 2026,
    catequistaNome: "Catequista João Paulo",
    sacramento: "1ª Eucaristia",
    horario: "Sábados às 15:00",
    sala: "Sala 02 - Centro Pastoral",
    bannerUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    totalAlunos: 18,
    aulaAtiva: {
      id: 101,
      pin: "4829",
      horarioExpiracao: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      descricao: "Encontro sobre a Eucaristia como Sacramento da Comunhão",
      presencasCount: 12
    },
    aulasHistorico: [
      {
        id: 1,
        data: "11/10/2026",
        tema: "Os Dez Mandamentos da Lei de Deus",
        descricao: "Reflexão sobre os mandamentos de amor a Deus e amor ao próximo na família e na escola.",
        totalPresentes: 16,
        totalFaltas: 2,
        alunosFaltantes: [
          { matricula: 10078, nome: "Pedro Henrique Oliveira", motivoJustificativa: "Viagem em família com aviso prévio" },
          { matricula: 10112, nome: "Ana Beatriz Costa" }
        ]
      },
      {
        id: 2,
        data: "04/10/2026",
        tema: "A Oração do Pai Nosso e a Vida em Comunidade",
        descricao: "Estudo verso a verso da oração que Jesus nos ensinou e partilha fraterna.",
        totalPresentes: 15,
        totalFaltas: 3,
        alunosFaltantes: [
          { matricula: 10112, nome: "Ana Beatriz Costa" },
          { matricula: 10350, nome: "Juliana Ferreira Lima" },
          { matricula: 10520, nome: "Mateus Ribeiro Albuquerque", motivoJustificativa: "Atestado médico de gripe" }
        ]
      },
      {
        id: 3,
        data: "27/09/2026",
        tema: "A Criação e o Cuidado com a Casa Comum",
        descricao: "Leitura do livro de Gênesis e conscientização sobre o respeito à natureza e aos irmãos.",
        totalPresentes: 16,
        totalFaltas: 2,
        alunosFaltantes: [
          { matricula: 10350, nome: "Juliana Ferreira Lima" },
          { matricula: 10455, nome: "Larissa Duarte Souza" }
        ]
      },
      {
        id: 4,
        data: "20/09/2026",
        tema: "Acolhida Pastoral e Entrega da Bíblia da Criança",
        descricao: "Primeiro encontro de integração dos catequizandos, catequistas e bênção das Bíblias pelo Pároco.",
        totalPresentes: 18,
        totalFaltas: 0,
        alunosFaltantes: []
      }
    ]
  },
  {
    id: 2,
    nomeTurma: "CRISMA DE JOVENS - TURMA A",
    anoLetivo: 2026,
    catequistaNome: "Catequista Maria Clara",
    sacramento: "Crisma",
    horario: "Sábados às 16:30",
    sala: "Auditório Paroquial",
    bannerUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    totalAlunos: 24,
    aulaAtiva: null
  },
  {
    id: 3,
    nomeTurma: "BATISMO - PREPARAÇÃO DE PAIS E PADRINHOS",
    anoLetivo: 2026,
    catequistaNome: "Diácono Roberto & Equipe",
    sacramento: "Batismo",
    horario: "Domingos às 08:30",
    sala: "Salão Paroquial",
    bannerUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
    totalAlunos: 15,
    aulaAtiva: null
  },
  {
    id: 4,
    nomeTurma: "1ª EUCARISTIA - ETAPA 2 (DOM 09H)",
    anoLetivo: 2026,
    catequistaNome: "Catequista Ana Beatriz",
    sacramento: "1ª Eucaristia",
    horario: "Domingos às 09:00",
    sala: "Sala 01 - Centro Pastoral",
    bannerUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    totalAlunos: 20,
    aulaAtiva: null
  },
  {
    id: 5,
    nomeTurma: "CRISMA DE ADULTOS - QUARTA NOTURNO",
    anoLetivo: 2026,
    catequistaNome: "Catequista Pe. Francisco",
    sacramento: "Adultos",
    horario: "Quartas-feiras às 19:30",
    sala: "Sala 04 - Secretaria",
    bannerUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80",
    totalAlunos: 14,
    aulaAtiva: null
  },
  {
    id: 6,
    nomeTurma: "PERSEVERANÇA INFANTO-JUVENIL",
    anoLetivo: 2026,
    catequistaNome: "Catequista Lucas & Juliana",
    sacramento: "Perseverança",
    horario: "Sábados às 14:00",
    sala: "Espaço Jovem",
    bannerUrl: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=800&q=80",
    totalAlunos: 16,
    aulaAtiva: null
  },
  {
    id: 7,
    nomeTurma: "CRISMA - TURMA CONCLUÍDA 2025",
    anoLetivo: 2025,
    catequistaNome: "Catequista Carlos Eduardo",
    sacramento: "Crisma",
    horario: "Sábados às 16:00",
    sala: "Auditório",
    bannerUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    totalAlunos: 28,
    aulaAtiva: null
  },
  {
    id: 8,
    nomeTurma: "1ª EUCARISTIA - CICLO 2024",
    anoLetivo: 2024,
    catequistaNome: "Catequista Helena Ramos",
    sacramento: "1ª Eucaristia",
    horario: "Domingos às 10:00",
    sala: "Sala 03",
    bannerUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    totalAlunos: 22,
    aulaAtiva: null
  }
];

export const INITIAL_ALUNOS_TURMA_1: Catequizando[] = [
  { 
    matricula: 10045, 
    nome: "Maria Clara Silva", 
    cpf: "123.456.789-01", 
    telefone: "(61) 98765-4321", 
    email: "mariaclara.silva@email.com",
    statusMatricula: "ATIVA", 
    presencaNaAula: true, 
    origemPresenca: "PIN",
    totalFaltas: 0,
    totalPresencas: 10,
    limiteFaltas: 5
  },
  { 
    matricula: 10078, 
    nome: "Pedro Henrique Oliveira", 
    cpf: "234.567.890-12", 
    telefone: "(61) 98111-2233", 
    email: "pedro.oliveira.pais@email.com",
    statusMatricula: "ATIVA", 
    presencaNaAula: true, 
    origemPresenca: "PIN",
    totalFaltas: 2,
    totalPresencas: 8,
    limiteFaltas: 5
  },
  { 
    matricula: 10112, 
    nome: "Ana Beatriz Costa", 
    cpf: "345.678.901-23", 
    telefone: "(61) 99222-3344", 
    email: "anabeatriz.costa@email.com",
    statusMatricula: "ATIVA", 
    presencaNaAula: true, 
    origemPresenca: "PIN",
    totalFaltas: 4,
    totalPresencas: 6,
    limiteFaltas: 5
  },
  { 
    matricula: 10203, 
    nome: "Lucas Felipe Santos", 
    cpf: "456.789.012-34", 
    telefone: "(61) 99333-4455", 
    email: "lucas.santos.catequese@email.com",
    statusMatricula: "ATIVA", 
    presencaNaAula: true, 
    origemPresenca: "MANUAL",
    totalFaltas: 1,
    totalPresencas: 9,
    limiteFaltas: 5
  },
  { 
    matricula: 10350, 
    nome: "Juliana Ferreira Lima", 
    cpf: "567.890.123-45", 
    telefone: "(61) 98444-5566", 
    email: "juliana.lima.resp@email.com",
    statusMatricula: "ATIVA", 
    presencaNaAula: false, 
    origemPresenca: "NENHUMA",
    totalFaltas: 5,
    totalPresencas: 5,
    limiteFaltas: 5
  },
  { 
    matricula: 10410, 
    nome: "Gabriel Mendes Rocha", 
    cpf: "678.901.234-56", 
    telefone: "(61) 98555-6677", 
    email: "gabriel.mendes@email.com",
    statusMatricula: "ATIVA", 
    presencaNaAula: true, 
    origemPresenca: "PIN",
    totalFaltas: 1,
    totalPresencas: 9,
    limiteFaltas: 5
  },
  { 
    matricula: 10455, 
    nome: "Larissa Duarte Souza", 
    cpf: "789.012.345-67", 
    telefone: "(61) 98666-7788", 
    email: "larissa.duarte.pais@email.com",
    statusMatricula: "ATIVA", 
    presencaNaAula: false, 
    origemPresenca: "NENHUMA",
    totalFaltas: 3,
    totalPresencas: 7,
    limiteFaltas: 5
  },
  { 
    matricula: 10520, 
    nome: "Mateus Ribeiro Albuquerque", 
    cpf: "890.123.456-78", 
    telefone: "(61) 98777-8899", 
    email: "mateus.albuquerque@email.com",
    statusMatricula: "ATIVA", 
    presencaNaAula: true, 
    origemPresenca: "PIN",
    totalFaltas: 2,
    totalPresencas: 8,
    limiteFaltas: 5
  }
];

export const INITIAL_FILA_ESPERA: FilaEsperaItem[] = [
  { id: 1, matriculaCatequizando: 10045, nomeCatequizando: "João Victor Martins", sacramentoDesejado: "1ª Eucaristia", dataSolicitacao: "2026-10-10", status: "PENDENTE" },
  { id: 2, matriculaCatequizando: 10078, nomeCatequizando: "Beatriz Nogueira Paz", sacramentoDesejado: "Crisma", dataSolicitacao: "2026-10-12", status: "PENDENTE" },
  { id: 3, matriculaCatequizando: 10112, nomeCatequizando: "Gustavo Henrique Dias", sacramentoDesejado: "Batismo", dataSolicitacao: "2026-10-14", status: "PENDENTE" }
];
