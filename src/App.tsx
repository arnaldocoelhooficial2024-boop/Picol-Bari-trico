/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Protocol } from './pages/Protocol';
import { Recipe } from './pages/Recipe';
import { Bonus } from './pages/Bonus';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Onboarding } from './pages/Onboarding';
import { SOS } from './pages/SOS';
import { Guide } from './pages/Guide';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AcessoNegado } from './pages/AcessoNegado';
import { ResetPassword } from './pages/ResetPassword';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/acesso-negado" element={<AcessoNegado />} />
        
        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="protocol" element={<Protocol />} />
            <Route path="recipe" element={<Recipe />} />
            <Route path="bonus" element={<Bonus />} />
            <Route path="profile" element={<Profile />} />
            <Route path="guide" element={<Guide />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
