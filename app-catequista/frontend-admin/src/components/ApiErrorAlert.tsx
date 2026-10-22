import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Database,
  Lock,
  RefreshCw,
  Server,
  WifiOff,
} from 'lucide-react';

export interface ApiErrorInfo {
  title: string;
  category: 'auth' | 'database' | 'network' | 'server' | 'unknown';
  description: string;
  cause: string;
  solution: string;
  status?: number;
  url?: string;
  method?: string;
  serverMessage?: string;
  raw?: any;
}

export function parseApiError(err: any, fallbackMessage = 'Ocorreu um erro na requisição.'): ApiErrorInfo {
  if (!err) {
    return {
      title: 'Erro desconhecido',
      category: 'unknown',
      description: fallbackMessage,
      cause: 'Não foi possível determinar a origem do erro.',
      solution: 'Tente recarregar a página.',
    };
  }

  const status = err.response?.status;
  const method = err.config?.method?.toUpperCase() || 'GET';
  const baseURL = err.config?.baseURL || API_BASE_URL;
  const url = err.config?.url ? `${baseURL}${err.config.url}` : baseURL;
  const serverMessage =
    err.response?.data?.message ||
    err.response?.data?.error ||
    (typeof err.response?.data === 'string' ? err.response.data : undefined);

  if (status === 401 || status === 403) {
    return {
      title: `Acesso Não Autorizado (HTTP ${status})`,
      category: 'auth',
      description: 'O servidor backend rejeitou a requisição por falta de autenticação válida.',
      cause:
        'A rota acessada exige um token JWT no cabeçalho Authorization. Como o login foi ignorado ou simulado para testes, o Spring Security bloqueou a consulta aos dados.',
      solution:
        'Faça login com um e-mail e senha cadastrados no banco para obter um token JWT real, ou configure a rota como pública no backend (SecurityConfig.java).',
      status,
      url,
      method,
      serverMessage,
      raw: err.response?.data,
    };
  }

  if (status >= 500 && status < 600) {
    if (status === 502 || status === 503 || status === 504) {
      return {
        title: `Servidor Temporariamente Indisponível (HTTP ${status})`,
        category: 'server',
        description: 'O serviço no Render não conseguiu responder dentro do tempo esperado.',
        cause:
          'Em planos gratuitos, o Render coloca instâncias inativas em hibernação. Ao receber a primeira chamada, ele pode levar de 30 a 60 segundos para iniciar completamente (Cold Start).',
        solution: 'Aguarde cerca de 30 a 50 segundos para o servidor subir e clique em "Tentar Novamente".',
        status,
        url,
        method,
        serverMessage,
        raw: err.response?.data,
      };
    }

    return {
      title: `Erro Interno do Servidor (HTTP ${status})`,
      category: 'database',
      description: 'O backend recebeu a requisição, mas falhou ao executá-la internamente.',
      cause:
        'Ocorreu uma exceção no Spring Boot ao consultar o banco de dados PostgreSQL (por exemplo: tabela inexistente, erro de chave estrangeira ou falha de conexão).',
      solution: 'Verifique os logs de execução do serviço no painel do Render para ver o erro detalhado.',
      status,
      url,
      method,
      serverMessage,
      raw: err.response?.data,
    };
  }

  if (status === 404) {
    return {
      title: 'Rota Não Encontrada (HTTP 404)',
      category: 'server',
      description: 'O endpoint solicitado não foi encontrado no servidor.',
      cause: `A rota "${url}" não existe ou a URL base da API está configurada incorretamente.`,
      solution: 'Verifique se a rota está implementada no controller do backend e mapeada corretamente.',
      status,
      url,
      method,
      serverMessage,
      raw: err.response?.data,
    };
  }

  if (err.request && !err.response) {
    return {
      title: 'Falha de Comunicação com a API',
      category: 'network',
      description: 'O navegador enviou a solicitação mas não recebeu nenhuma resposta.',
      cause:
        `Não foi possível alcançar ${baseURL}. Causas comuns incluem: servidor do Render hibernando ou desligado, bloqueio de CORS pelo navegador ou falta de internet.`,
      solution:
        'Verifique se a URL do backend está correta e se a aplicação no Render está no status "Live".',
      status: 0,
      url,
      method,
      raw: { message: err.message, code: err.code },
    };
  }

  return {
    title: 'Erro na Requisição',
    category: 'unknown',
    description: serverMessage || err.message || fallbackMessage,
    cause: 'Ocorreu um comportamento inesperado durante a chamada.',
    solution: 'Recarregue a página ou tente novamente mais tarde.',
    status,
    url,
    method,
    serverMessage,
    raw: err.response?.data || err.message,
  };
}

interface ApiErrorAlertProps {
  error: any;
  onRetry?: () => void;
  className?: string;
}

export const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<{
    tested: boolean;
    online: boolean;
    dbConnected: boolean;
    product?: string;
    version?: string;
    error?: string;
  } | null>(null);

  if (!error) return null;

  const info: ApiErrorInfo =
    typeof error === 'string'
      ? {
          title: 'Erro no Sistema',
          category: 'unknown',
          description: error,
          cause: 'O sistema retornou uma mensagem de erro.',
          solution: 'Tente recarregar a tela.',
        }
      : parseApiError(error);

  const checkDatabaseHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 15000 });
      const data = response.data;
      setHealthResult({
        tested: true,
        online: data.status === 'UP',
        dbConnected: Boolean(data.database?.connected),
        product: data.database?.product,
        version: data.database?.version,
      });
    } catch (err: any) {
      setHealthResult({
        tested: true,
        online: false,
        dbConnected: false,
        error:
          err.response?.data?.database?.error ||
          err.response?.data?.message ||
          err.message ||
          'Não foi possível responder na rota /health',
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const hasToken = Boolean(
    localStorage.getItem('catequiza_token') || localStorage.getItem('catequiza_jwt_token')
  );

  return (
    <div
      className={`rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-xs text-red-200 shadow-md animate-fadeIn ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-900/40 text-red-300 shrink-0 mt-0.5">
            {info.category === 'auth' && <Lock className="w-4 h-4 text-amber-400" />}
            {info.category === 'database' && <Database className="w-4 h-4 text-red-400" />}
            {info.category === 'network' && <WifiOff className="w-4 h-4 text-amber-400" />}
            {info.category === 'server' && <Server className="w-4 h-4 text-orange-400" />}
            {info.category === 'unknown' && <AlertCircle className="w-4 h-4 text-red-400" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-white text-sm tracking-tight">{info.title}</h4>
              {info.status !== undefined && info.status > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-900/60 text-red-300 border border-red-800">
                  HTTP {info.status}
                </span>
              )}
            </div>

            <p className="text-slate-300 leading-relaxed">{info.description}</p>

            <div className="pt-1.5 space-y-1">
              <p className="text-slate-400">
                <strong className="text-slate-200">Motivo:</strong> {info.cause}
              </p>
              <p className="text-slate-400">
                <strong className="text-slate-200">Como resolver:</strong> {info.solution}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start mt-2 sm:mt-0">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800/60 text-white font-medium text-xs transition-colors border border-red-700/50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar Novamente</span>
            </button>
          )}

          <button
            onClick={checkDatabaseHealth}
            disabled={isCheckingHealth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700 disabled:opacity-50"
            title="Executa teste no endpoint /health da API"
          >
            {isCheckingHealth ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-parish-400" />
            ) : (
              <Database className="w-3.5 h-3.5 text-parish-400" />
            )}
            <span>Diagnosticar Conexão</span>
          </button>
        </div>
      </div>

      {healthResult && (
        <div
          className={`mt-3 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
            healthResult.online && healthResult.dbConnected
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
          }`}
        >
          {healthResult.online && healthResult.dbConnected ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-0.5">
            <p className="font-semibold text-white">
              {healthResult.online && healthResult.dbConnected
                ? 'Diagnóstico da Conexão: Backend e Banco de Dados estão ONLINE!'
                : 'Diagnóstico da Conexão: Falha identificada na API'}
            </p>
            {healthResult.online && healthResult.dbConnected ? (
              <p className="text-emerald-300">
                A API respondeu com sucesso e a conexão com o PostgreSQL ({healthResult.product || 'PostgreSQL'}) está ativa.
                Isso confirma que o banco de dados está funcionando perfeitamente e o erro atual decorre de autenticação/permissão.
              </p>
            ) : (
              <p className="text-amber-300">
                {healthResult.error || 'O backend não conseguiu se comunicar com o banco de dados ou a rota /health não respondeu.'}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-red-900/40 flex items-center justify-between">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showDetails ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos da requisição'}</span>
        </button>

        <span className="text-[11px] text-slate-400 font-mono">
          Token JWT local: {hasToken ? 'Presente' : 'Ausente (Não logado)'}
        </span>
      </div>

      {showDetails && (
        <div className="mt-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-x-auto">
          {info.method && info.url && (
            <div>
              <span className="text-slate-500">Endpoint: </span>
              <span className="text-parish-400 font-semibold">{info.method}</span> {info.url}
            </div>
          )}
          {info.status !== undefined && (
            <div>
              <span className="text-slate-500">Status HTTP: </span>
              <span className={info.status >= 400 ? 'text-red-400' : 'text-emerald-400'}>
                {info.status}
              </span>
            </div>
          )}
          {info.serverMessage && (
            <div>
              <span className="text-slate-500">Mensagem do servidor: </span>
              <span className="text-amber-300">{info.serverMessage}</span>
            </div>
          )}
          {info.raw && (
            <div>
              <span className="text-slate-500">Payload bruto: </span>
              <pre className="mt-1 text-[10px] text-slate-400 whitespace-pre-wrap max-h-36 overflow-y-auto bg-slate-900 p-2 rounded">
                {JSON.stringify(info.raw, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
