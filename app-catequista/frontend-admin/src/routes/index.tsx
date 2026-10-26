import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../features/auth/pages/Login';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

import { CatequizandoList } from '../features/catequizandos/pages/CatequizandoList';
import { CatequizandoForm } from '../features/catequizandos/pages/CatequizandoForm';
import { TurmaList } from '../features/turmas/pages/TurmaList';

const FeatureEmConstrucao: React.FC<{ titulo: string }> = ({ titulo }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center max-w-lg mx-auto my-12">
    <h2 className="text-lg font-bold text-white mb-2">{titulo}</h2>
    <p className="text-xs text-slate-400">
      Módulo pronto para ser implementado consumindo o endpoint correspondente do backend.
    </p>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/turmas" replace />} />
            
            <Route path="/turmas" element={<TurmaList />} />
            
            <Route path="/catequizandos" element={<CatequizandoList />} />
            <Route path="/catequizandos/novo" element={<CatequizandoForm />} />
            <Route path="/catequizandos/:matricula/editar" element={<CatequizandoForm />} />

            <Route path="/matriculas/*" element={<FeatureEmConstrucao titulo="Módulo de Matrículas" />} />
            <Route path="/aulas/*" element={<FeatureEmConstrucao titulo="Módulo de Aulas & PIN" />} />
            <Route path="/fila-espera/*" element={<FeatureEmConstrucao titulo="Módulo de Fila de Espera" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
