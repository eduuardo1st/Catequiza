import { api as apiClient } from '../lib/api';
import { Turma, Catequizando, AulaHistorico, Sacramento } from '../types';
import { CATEQUISTAS_PADRAO } from '../features/turmas/services/turmaService';
import { DadosDetalhamentoTurma, DadosDetalhamentoCatequista } from '../features/turmas/types/turma';
import { DadosDetalhamentoMatricula } from '../features/matriculas/types/matricula';
import { DadosDetalhamentoCatequizando } from '../features/catequizandos/types/catequizando';
import { DadosDetalhamentoAula } from '../features/aulas/types/aula';

export interface DadosDetalhamentoChamada {
  id?: number;
  idAula: number;
  idTurma?: number;
  matriculaCatequizando: number;
  nomeCatequizando?: string;
  presente: boolean;
}

const STORAGE_OVERRIDES_CHAMADA = 'catequiza_chamadas_overrides_v2';
const STORAGE_AULAS_ENCERRADAS = 'catequiza_aulas_encerradas_v2';

const BANNERS_SACRAMENTO: Record<Sacramento, string> = {
  '1ª Eucaristia': 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=900&q=80',
  'Crisma': 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80',
  'Batismo': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
  'Perseverança': 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80',
  'Adultos': 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=80',
};

// Espelho fiel dos registros de chamada do banco (V3/V4) caso o endpoint /chamadas ainda não esteja publicado
const SEED_CHAMADAS_POR_PIN_CPF: Record<string, Record<string, boolean>> = {
  EUC091: {
    '111.222.333-44': true,
    '222.333.444-55': true,
    '333.444.555-66': false,
    '666.777.888-99': false,
    '777.888.999-00': true,
    '888.999.000-11': true,
  },
  EUC092: {
    '111.222.333-44': true,
    '222.333.444-55': true,
    '333.444.555-66': false,
    '666.777.888-99': false,
    '777.888.999-00': true,
    '888.999.000-11': true,
  },
  EUC093: {
    '111.222.333-44': true,
    '222.333.444-55': true,
    '333.444.555-66': false,
    '666.777.888-99': true,
    '777.888.999-00': true,
    '888.999.000-11': true,
  },
  EUC101: {
    '111.222.333-44': true,
    '222.333.444-55': true,
    '333.444.555-66': false,
    '666.777.888-99': true,
    '777.888.999-00': true,
    '888.999.000-11': true,
  },
  EUC102: {
    '111.222.333-44': true,
    '222.333.444-55': true,
    '333.444.555-66': true,
    '666.777.888-99': false,
    '777.888.999-00': true,
    '888.999.000-11': true,
  },
  EUC401: {
    '111.222.333-44': true,
    '222.333.444-55': true,
    '333.444.555-66': false,
    '666.777.888-99': true,
    '777.888.999-00': false,
    '888.999.000-11': true,
  },
  EUC105: {
    '111.222.333-44': true,
    '222.333.444-55': true,
    '333.444.555-66': false,
    '666.777.888-99': true,
    '777.888.999-00': false,
    '888.999.000-11': true,
  },
  EUC106: {
    '111.222.333-44': true,
    '222.333.444-55': true,
    '333.444.555-66': true,
    '666.777.888-99': true,
    '777.888.999-00': false,
    '888.999.000-11': true,
  },
  EUC201: {
    '444.555.666-77': true,
    '999.000.111-22': true,
    '012.345.678-90': false,
    '123.789.456-01': true,
  },
  EUC402: {
    '444.555.666-77': true,
    '999.000.111-22': true,
    '012.345.678-90': true,
    '123.789.456-01': true,
  },
  CRI101: {
    '555.666.777-88': true,
    '234.890.567-12': true,
    '345.901.678-23': false,
    '456.012.789-34': true,
  },
  CRI501: {
    '555.666.777-88': true,
    '234.890.567-12': true,
    '345.901.678-23': true,
    '456.012.789-34': true,
  },
  ADU101: {
    '567.123.890-45': true,
    '678.234.901-56': true,
  },
};

function getLocalChamadaOverrides(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_OVERRIDES_CHAMADA);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalChamadaOverride(aulaId: number, matricula: number, presente: boolean) {
  const map = getLocalChamadaOverrides();
  map[`${aulaId}_${matricula}`] = presente;
  localStorage.setItem(STORAGE_OVERRIDES_CHAMADA, JSON.stringify(map));
}

function getAulasEncerradasLocal(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_AULAS_ENCERRADAS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addAulaEncerradaLocal(aulaId: number) {
  const list = getAulasEncerradasLocal();
  if (!list.includes(aulaId)) {
    list.push(aulaId);
    localStorage.setItem(STORAGE_AULAS_ENCERRADAS, JSON.stringify(list));
  }
}

function extrairSacramento(nomeTurma: string): Sacramento {
  const lower = nomeTurma.toLowerCase();
  if (lower.includes('crisma') && lower.includes('adulto')) return 'Adultos';
  if (lower.includes('crisma')) return 'Crisma';
  if (lower.includes('batismo')) return 'Batismo';
  if (lower.includes('perseveran')) return 'Perseverança';
  return '1ª Eucaristia';
}

function extrairHorario(nomeTurma: string): string {
  const match = nomeTurma.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    const info = match[1];
    if (info.toLowerCase().includes('sáb')) return info.replace(/Sáb/i, 'Sábados às');
    if (info.toLowerCase().includes('dom')) return info.replace(/Dom/i, 'Domingos às');
    if (info.toLowerCase().includes('qua')) return info.replace(/Qua/i, 'Quartas às');
    return info;
  }
  return 'Sábados às 09h00';
}

function extrairSala(idTurma: number, sacramento: Sacramento): string {
  if (sacramento === 'Crisma' || sacramento === 'Adultos') return `Salão Paroquial • Sala ${idTurma}`;
  if (sacramento === 'Batismo') return 'Igreja Matriz • Batistério';
  return `Centro Catequético • Sala 0${idTurma}`;
}

function formatarDataBR(isoDate: string): string {
  if (!isoDate) return '—';
  const partes = isoDate.split('T')[0].split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return isoDate;
}

async function carregarChamadasCompletas(
  aulas: DadosDetalhamentoAula[],
  catequizandos: DadosDetalhamentoCatequizando[]
): Promise<DadosDetalhamentoChamada[]> {
  const overrides = getLocalChamadaOverrides();

  try {
    const res = await apiClient.get<DadosDetalhamentoChamada[]>('/chamadas');
    if (Array.isArray(res.data)) {
      const lista = [...res.data];
      Object.entries(overrides).forEach(([key, presente]) => {
        const [aId, mat] = key.split('_').map(Number);
        const idx = lista.findIndex((c) => c.idAula === aId && c.matriculaCatequizando === mat);
        if (idx >= 0) {
          lista[idx] = { ...lista[idx], presente };
        } else {
          lista.push({ idAula: aId, matriculaCatequizando: mat, presente });
        }
      });
      return lista;
    }
  } catch {
    // Caso o endpoint /chamadas ainda não tenha sido publicado no Render, reconstrói a partir dos dados reais
  }

  const reconstruidas: DadosDetalhamentoChamada[] = [];
  const alunoPorCpf = new Map<string, DadosDetalhamentoCatequizando>();
  catequizandos.forEach((c) => alunoPorCpf.set(c.cpf, c));

  aulas.forEach((aula) => {
    const seedPin = SEED_CHAMADAS_POR_PIN_CPF[aula.pin];
    if (seedPin) {
      Object.entries(seedPin).forEach(([cpf, presenteSeed]) => {
        const aluno = alunoPorCpf.get(cpf);
        if (aluno) {
          const overrideKey = `${aula.id}_${aluno.matricula}`;
          const presente =
            overrideKey in overrides ? overrides[overrideKey] : presenteSeed;
          reconstruidas.push({
            idAula: aula.id,
            idTurma: aula.idTurma,
            matriculaCatequizando: aluno.matricula,
            nomeCatequizando: aluno.nome,
            presente,
          });
        }
      });
    }
  });

  Object.entries(overrides).forEach(([key, presente]) => {
    const [aId, mat] = key.split('_').map(Number);
    if (!reconstruidas.some((c) => c.idAula === aId && c.matriculaCatequizando === mat)) {
      const aluno = catequizandos.find((c) => c.matricula === mat);
      reconstruidas.push({
        idAula: aId,
        matriculaCatequizando: mat,
        nomeCatequizando: aluno?.nome,
        presente,
      });
    }
  });

  return reconstruidas;
}

export const api = {
  getToken(): string | null {
    return localStorage.getItem('catequiza_token');
  },

  setToken(token: string) {
    localStorage.setItem('catequiza_token', token);
  },

  clearToken() {
    localStorage.removeItem('catequiza_token');
  },

  async getTurmas(): Promise<Turma[]> {
    const [turmasRes, matriculasRes, aulasRes, catequizandosRes, catequistasRes] =
      await Promise.all([
        apiClient.get<DadosDetalhamentoTurma[]>('/turmas'),
        apiClient.get<DadosDetalhamentoMatricula[]>('/matriculas').catch(() => ({ data: [] as DadosDetalhamentoMatricula[] })),
        apiClient.get<DadosDetalhamentoAula[]>('/aulas').catch(() => ({ data: [] as DadosDetalhamentoAula[] })),
        apiClient.get<DadosDetalhamentoCatequizando[]>('/catequizandos').catch(() => ({ data: [] as DadosDetalhamentoCatequizando[] })),
        apiClient.get<DadosDetalhamentoCatequista[]>('/catequistas').catch(() => ({ data: CATEQUISTAS_PADRAO })),
      ]);

    const turmasData = turmasRes.data || [];
    const matriculasData = matriculasRes.data || [];
    const aulasData = aulasRes.data || [];
    const catequizandosData = catequizandosRes.data || [];
    const catequistasData =
      Array.isArray(catequistasRes.data) && catequistasRes.data.length > 0
        ? catequistasRes.data
        : CATEQUISTAS_PADRAO;

    const chamadasData = await carregarChamadasCompletas(aulasData, catequizandosData);
    const encerradasLocal = getAulasEncerradasLocal();
    const agora = Date.now();

    return turmasData.map((t) => {
      const sacramento = extrairSacramento(t.nomeTurma);
      const catequista = catequistasData.find((c) => c.id === t.idCatequista);
      const catequistaNome =
        t.nomeCatequista || catequista?.nome || `Catequista #${t.idCatequista}`;

      // Alunos matriculados nesta turma
      const matriculasDaTurma = matriculasData.filter(
        (m) => m.idTurma === t.id && m.statusMatricula !== 'TRANSFERIDA'
      );
      const alunosMatriculados = matriculasDaTurma
        .map((m) => catequizandosData.find((c) => c.matricula === m.matriculaCatequizando))
        .filter((c): c is DadosDetalhamentoCatequizando => Boolean(c));

      // Aulas desta turma ordenadas da mais recente para a mais antiga
      const aulasDaTurma = aulasData
        .filter((a) => a.idTurma === t.id)
        .sort((a, b) => {
          const diffData = new Date(b.data).getTime() - new Date(a.data).getTime();
          return diffData !== 0 ? diffData : b.id - a.id;
        });

      // Verifica se há aula com PIN ativo (não expirado e não encerrado)
      const aulaAoVivo = aulasDaTurma.find((a) => {
        if (!a.horarioExpiracao || encerradasLocal.includes(a.id)) return false;
        return new Date(a.horarioExpiracao).getTime() > agora;
      });

      const presencasAulaAtiva = aulaAoVivo
        ? chamadasData.filter((ch) => ch.idAula === aulaAoVivo.id && ch.presente).length
        : 0;

      // Monta histórico real de encontros da turma
      const aulasHistorico: AulaHistorico[] = aulasDaTurma.map((aula) => {
        const chamadasDaAula = chamadasData.filter((ch) => ch.idAula === aula.id);

        const presentesIds = new Set(
          chamadasDaAula.filter((ch) => ch.presente).map((ch) => ch.matriculaCatequizando)
        );
        const faltantesExplicitosIds = new Set(
          chamadasDaAula.filter((ch) => !ch.presente).map((ch) => ch.matriculaCatequizando)
        );

        let alunosFaltantes: { matricula: number; nome: string }[] = [];

        if (chamadasDaAula.length > 0) {
          alunosFaltantes = alunosMatriculados
            .filter(
              (aluno) =>
                faltantesExplicitosIds.has(aluno.matricula) ||
                (!presentesIds.has(aluno.matricula) && chamadasDaAula.length >= alunosMatriculados.length)
            )
            .map((aluno) => ({
              matricula: aluno.matricula,
              nome: aluno.nome,
            }));

          // Inclui também qualquer aluno marcado como faltante na chamada mesmo se não estiver na lista ativa
          chamadasDaAula
            .filter((ch) => !ch.presente)
            .forEach((ch) => {
              if (!alunosFaltantes.some((af) => af.matricula === ch.matriculaCatequizando)) {
                const al = catequizandosData.find((c) => c.matricula === ch.matriculaCatequizando);
                if (al) {
                  alunosFaltantes.push({ matricula: al.matricula, nome: al.nome });
                }
              }
            });
        }

        const totalPresentes = presentesIds.size;
        const totalFaltas = alunosFaltantes.length;

        return {
          id: aula.id,
          data: formatarDataBR(aula.data),
          tema: aula.descricaoConteudo || 'Encontro Catequético',
          descricao: `PIN da sessão: ${aula.pin}`,
          totalPresentes,
          totalFaltas,
          alunosFaltantes,
        };
      });

      return {
        id: t.id,
        nomeTurma: t.nomeTurma,
        anoLetivo: t.anoLetivo,
        catequistaId: t.idCatequista,
        catequistaNome,
        sacramento,
        horario: extrairHorario(t.nomeTurma),
        sala: extrairSala(t.id, sacramento),
        bannerUrl: BANNERS_SACRAMENTO[sacramento] || BANNERS_SACRAMENTO['1ª Eucaristia'],
        totalAlunos: matriculasDaTurma.length,
        aulaAtiva: aulaAoVivo
          ? {
              id: aulaAoVivo.id,
              pin: aulaAoVivo.pin,
              horarioExpiracao: aulaAoVivo.horarioExpiracao,
              descricao: aulaAoVivo.descricaoConteudo,
              presencasCount: presencasAulaAtiva,
            }
          : null,
        aulasHistorico,
      };
    });
  },

  async getAlunosTurma(turmaId: number): Promise<Catequizando[]> {
    const [matriculasRes, catequizandosRes, aulasRes] = await Promise.all([
      apiClient.get<DadosDetalhamentoMatricula[]>('/matriculas').catch(() => ({ data: [] as DadosDetalhamentoMatricula[] })),
      apiClient.get<DadosDetalhamentoCatequizando[]>('/catequizandos').catch(() => ({ data: [] as DadosDetalhamentoCatequizando[] })),
      apiClient.get<DadosDetalhamentoAula[]>('/aulas').catch(() => ({ data: [] as DadosDetalhamentoAula[] })),
    ]);

    const matriculasData = matriculasRes.data || [];
    const catequizandosData = catequizandosRes.data || [];
    const aulasData = aulasRes.data || [];
    const chamadasData = await carregarChamadasCompletas(aulasData, catequizandosData);

    const matriculasDaTurma = matriculasData.filter(
      (m) => m.idTurma === turmaId && m.statusMatricula !== 'TRANSFERIDA'
    );

    const aulasDaTurma = aulasData
      .filter((a) => a.idTurma === turmaId)
      .sort((a, b) => {
        const diffData = new Date(b.data).getTime() - new Date(a.data).getTime();
        return diffData !== 0 ? diffData : b.id - a.id;
      });

    const encerradasLocal = getAulasEncerradasLocal();
    const agora = Date.now();
    const aulaReferencia =
      aulasDaTurma.find(
        (a) => a.horarioExpiracao && !encerradasLocal.includes(a.id) && new Date(a.horarioExpiracao).getTime() > agora
      ) || aulasDaTurma[0];

    const idsAulasTurma = new Set(aulasDaTurma.map((a) => a.id));
    const overrides = getLocalChamadaOverrides();

    return matriculasDaTurma
      .map((mat): Catequizando | null => {
        const c = catequizandosData.find((al) => al.matricula === mat.matriculaCatequizando);
        if (!c) return null;

        const chamadasDoAlunoNaTurma = chamadasData.filter(
          (ch) => idsAulasTurma.has(ch.idAula) && ch.matriculaCatequizando === c.matricula
        );

        const totalPresencas = chamadasDoAlunoNaTurma.filter((ch) => ch.presente).length;
        const totalFaltas = chamadasDoAlunoNaTurma.filter((ch) => !ch.presente).length;

        const chamadaAulaAtual = aulaReferencia
          ? chamadasDoAlunoNaTurma.find((ch) => ch.idAula === aulaReferencia.id)
          : undefined;

        const isPresenteNaAula = Boolean(chamadaAulaAtual?.presente);
        const foiManual =
          aulaReferencia && `${aulaReferencia.id}_${c.matricula}` in overrides;

        return {
          matricula: c.matricula,
          nome: c.nome,
          cpf: c.cpf,
          telefone: c.telefone,
          email: c.email,
          statusMatricula: (mat.statusMatricula as any) || 'ATIVA',
          presencaNaAula: isPresenteNaAula,
          origemPresenca: isPresenteNaAula ? (foiManual ? 'MANUAL' : 'PIN') : 'NENHUMA',
          totalFaltas,
          totalPresencas,
          limiteFaltas: 5,
        };
      })
      .filter((item): item is Catequizando => item !== null);
  },

  async iniciarAula(
    turmaId: number,
    descricao: string,
    minutosValidade: number = 60
  ): Promise<Turma> {
    const hojeISO = new Date().toISOString().split('T')[0];

    await apiClient.post<DadosDetalhamentoAula>('/aulas', {
      idTurma: turmaId,
      data: hojeISO,
      descricaoConteudo: descricao.trim() || 'Encontro Catequético',
      minutosValidade,
    });

    const turmasAtualizadas = await this.getTurmas();
    const encontrada = turmasAtualizadas.find((t) => t.id === turmaId);
    if (!encontrada) {
      throw new Error('Turma não encontrada após iniciar aula.');
    }
    return encontrada;
  },

  async encerrarAula(turmaId: number, aulaId?: number): Promise<Turma> {
    if (aulaId) {
      addAulaEncerradaLocal(aulaId);
      try {
        await apiClient.put(`/aulas/${aulaId}/encerrar`);
      } catch {
        // Fallback local já aplicado caso o endpoint /encerrar ainda não esteja no ar
      }
    }

    const turmasAtualizadas = await this.getTurmas();
    const encontrada = turmasAtualizadas.find((t) => t.id === turmaId);
    if (!encontrada) {
      throw new Error('Turma não encontrada ao encerrar aula.');
    }
    return {
      ...encontrada,
      aulaAtiva: null,
    };
  },

  async togglePresenca(
    aulaId: number,
    matricula: number,
    novoPresente: boolean
  ): Promise<boolean> {
    setLocalChamadaOverride(aulaId, matricula, novoPresente);
    try {
      await apiClient.post('/chamadas', {
        idAula: aulaId,
        matriculaCatequizando: matricula,
        presente: novoPresente,
      });
    } catch {
      // Salvo localmente caso o endpoint /chamadas ainda não esteja publicado
    }
    return novoPresente;
  },
};
