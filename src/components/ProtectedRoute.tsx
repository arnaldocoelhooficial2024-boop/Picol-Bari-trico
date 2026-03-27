import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLiberado, setIsLiberado] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Obter usuário logado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Buscar no banco usando ID
        const { data, error } = await supabase
          .from('users_access')
          .select('*')
          .eq('id', user.id)
          .single();

        // Validar acesso
        if (!data || data.liberado !== true) {
          setIsLiberado(false);
        } else {
          setIsLiberado(true);
        }
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        setIsLiberado(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isLiberado) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
}
