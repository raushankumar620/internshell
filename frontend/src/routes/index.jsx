import { useRoutes } from 'react-router-dom';
import { lazy } from 'react';

// project import
import Loadable from 'component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// routes
import MainRoutes from './MainRoutes';
import InternRoutes from './InternRoutes';
import AdminRoutes from './AdminRoutes';
import { EmployerLandingRoute, EmployerDashboardRoutes } from './EmployerRoutes';
import { AuthenticationRoutes, AuthPagesRoutes, OtherAuthRoutes, PublicPageRoutes } from './AuthenticationRoutes';

// 404 Page
const NotFound = Loadable(lazy(() => import('views/NotFound')));

// Catch-all route for 404
const CatchAllRoutes = {
  path: '*',
  element: <MinimalLayout />,
  children: [
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    AuthenticationRoutes, 
    AuthPagesRoutes,
    OtherAuthRoutes,
    PublicPageRoutes, 
    InternRoutes, 
    EmployerLandingRoute, 
    EmployerDashboardRoutes, 
    AdminRoutes,
    MainRoutes,
    CatchAllRoutes // This should be last
  ]);
}