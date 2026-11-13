import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../features/auth/pages/Login';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

import { CatequizandoList } from '../features/catequizandos/pages/CatequizandoList';
import { CatequizandoForm } from '../features/catequizandos/pages/CatequizandoForm';
import { TurmaList } from '../features/turmas/pages/TurmaList';
import { MatriculaList } from '../features/matriculas/pages/MatriculaList';
import { AulaList } from '../features/aulas/pages/AulaList';
import { FilaEsperaList } from '../features/fila-espera/pages/FilaEsperaList';


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

            <Route path="/matriculas" element={<MatriculaList />} />
            <Route path="/aulas" element={<AulaList />} />
            <Route path="/fila-espera" element={<FilaEsperaList />} />
            <Route path="/fila-espera/*" element={<FilaEsperaList />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
