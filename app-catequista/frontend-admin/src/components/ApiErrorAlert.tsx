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
        'A rota acessada exige um token JWT no cabeçalho Authorization ou permissão administrativa.',
      solution:
        'Faça login com um e-mail e senha cadastrados para obter um token JWT válido.',
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
          'Instâncias em hibernação podem levar de 30 a 60 segundos para iniciar completamente (Cold Start).',
        solution: 'Aguarde alguns segundos e clique em "Tentar Novamente".',
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
      cause: 'Ocorreu uma exceção no serviço ao consultar o banco de dados PostgreSQL.',
      solution: 'Verifique os logs do serviço no painel do Render ou tente novamente.',
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
      cause: `A rota "${url}" não existe ou ainda não foi publicada.`,
      solution: 'Verifique se a versão mais recente do backend foi publicada.',
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
      cause: `Não foi possível alcançar ${baseURL}. O servidor pode estar hibernando ou sem conexão.`,
      solution: 'Aguarde alguns instantes e clique em "Tentar Novamente".',
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
          title: 'Atenção',
          category: 'unknown',
          description: error,
          cause: 'Verifique os dados informados.',
          solution: 'Corrija o campo indicado e tente novamente.',
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
      className={`rounded-xl border border-red-200 bg-red-50/90 p-4 text-xs text-red-900 shadow-sm animate-fadeIn ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0 mt-0.5">
            {info.category === 'auth' && <Lock className="w-4 h-4 text-amber-700" />}
            {info.category === 'database' && <Database className="w-4 h-4 text-red-700" />}
            {info.category === 'network' && <WifiOff className="w-4 h-4 text-amber-700" />}
            {info.category === 'server' && <Server className="w-4 h-4 text-red-700" />}
            {info.category === 'unknown' && <AlertCircle className="w-4 h-4 text-red-700" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-red-950 text-sm tracking-tight">{info.title}</h4>
              {info.status !== undefined && info.status > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-100 text-red-800 border border-red-200">
                  HTTP {info.status}
                </span>
              )}
            </div>

            <p className="text-red-900 leading-relaxed">{info.description}</p>

            <div className="pt-1 space-y-1 text-red-800/90">
              <p>
                <strong className="text-red-950">Motivo:</strong> {info.cause}
              </p>
              <p>
                <strong className="text-red-950">Como resolver:</strong> {info.solution}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start mt-2 sm:mt-0">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar Novamente</span>
            </button>
          )}

          <button
            onClick={checkDatabaseHealth}
            disabled={isCheckingHealth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-carmel-50 text-carmel-800 font-semibold text-xs transition-colors border border-carmel-200 disabled:opacity-50"
            title="Executa teste no endpoint /health da API"
          >
            {isCheckingHealth ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-700" />
            ) : (
              <Database className="w-3.5 h-3.5 text-gold-700" />
            )}
            <span>Diagnosticar Conexão</span>
          </button>
        </div>
      </div>

      {healthResult && (
        <div
          className={`mt-3 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
            healthResult.online && healthResult.dbConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {healthResult.online && healthResult.dbConnected ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          )}

          <div className="space-y-0.5">
            <p className="font-semibold">
              {healthResult.online && healthResult.dbConnected
                ? 'Diagnóstico da Conexão: Backend e Banco de Dados estão ONLINE!'
                : 'Diagnóstico da Conexão: Falha identificada na API'}
            </p>
            {healthResult.online && healthResult.dbConnected ? (
              <p className="text-emerald-800">
                A API respondeu com sucesso e a conexão com o {healthResult.product || 'PostgreSQL'} está ativa.
              </p>
            ) : (
              <p className="text-amber-800">
                {healthResult.error || 'O backend não respondeu na rota /health.'}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-red-200/80 flex items-center justify-between">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-800 hover:text-red-950 transition-colors"
        >
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showDetails ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos da requisição'}</span>
        </button>

        <span className="text-[11px] text-red-800/80 font-mono">
          Token JWT: {hasToken ? 'Presente' : 'Ausente'}
        </span>
      </div>

      {showDetails && (
        <div className="mt-2.5 p-3 rounded-lg bg-white border border-red-200 font-mono text-[11px] text-carmel-800 space-y-1.5 overflow-x-auto">
          {info.method && info.url && (
            <div>
              <span className="text-carmel-500">Endpoint: </span>
              <span className="text-gold-700 font-semibold">{info.method}</span> {info.url}
            </div>
          )}
          {info.status !== undefined && (
            <div>
              <span className="text-carmel-500">Status HTTP: </span>
              <span className={info.status >= 400 ? 'text-red-700 font-semibold' : 'text-emerald-700'}>
                {info.status}
              </span>
            </div>
          )}
          {info.serverMessage && (
            <div>
              <span className="text-carmel-500">Mensagem: </span>
              <span className="text-amber-800">{info.serverMessage}</span>
            </div>
          )}
          {info.raw && (
            <div>
              <span className="text-carmel-500">Payload: </span>
              <pre className="mt-1 text-[10px] text-carmel-700 whitespace-pre-wrap max-h-36 overflow-y-auto bg-carmel-50 p-2 rounded border border-carmel-200">
                {JSON.stringify(info.raw, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
