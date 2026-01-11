import { lazy } from 'react';

// Project imports
import Loadable from 'component/Loadable';

// Admin lazy imports
const AdminLogin = Loadable(lazy(() => import('views/Admin/AdminLogin')));
const AdminDashboard = Loadable(lazy(() => import('views/Admin/AdminDashboard')));
const BlogManagement = Loadable(lazy(() => import('views/Admin/blogpage')));
const UserPage = Loadable(lazy(() => import('views/Admin/UserPage')));
const JobPage = Loadable(lazy(() => import('views/Admin/JobPage')));
const ApplicationPage = Loadable(lazy(() => import('views/Admin/ApplicationPage')));
const AnalyticsPage = Loadable(lazy(() => import('views/Admin/AnalyticsPage')));
const SecurityPage = Loadable(lazy(() => import('views/Admin/SecurityPage')));
const NotificationsPage = Loadable(lazy(() => import('views/Admin/NotificationsPage')));

// ==============================|| ADMIN ROUTES ||============================== //

const AdminRoutes = {
  path: '/admin',
  children: [
    {
      path: 'login',
      element: <AdminLogin />
    },
    {
      path: 'dashboard',
      element: <AdminDashboard />
    },
    {
      path: 'users',
      element: <UserPage />
    },
    {
      path: 'jobs',
      element: <JobPage />
    },
    {
      path: 'applications',
      element: <ApplicationPage />
    },
    {
      path: 'blog',
      element: <BlogManagement />
    },
    {
      path: 'analytics',
      element: <AnalyticsPage />
    },
    {
      path: 'security',
      element: <SecurityPage />
    },
    {
      path: 'notifications',
      element: <NotificationsPage />
    },
    {
      path: 'reports',
      element: <AnalyticsPage />
    },
    {
      path: 'settings',
      element: <SecurityPage />
    },
    {
      path: 'support',
      element: <NotificationsPage />
    }
  ]
};

export default AdminRoutes;