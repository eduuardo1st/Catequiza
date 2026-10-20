import React from 'react';
import { Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  return <Outlet />;
};
