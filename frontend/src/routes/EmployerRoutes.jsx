import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import MainLayout from 'layout/MainLayout';
import EmployerLayout from 'layout/EmployerLayout';
import Loadable from 'component/Loadable';
import ProtectedRoute from 'component/ProtectedRoute';

// Employer Pages
const EmployerDashboard = Loadable(lazy(() => import('views/Employer/Dashboard')));
const EmployerLanding = Loadable(lazy(() => import('views/Employer/Landing')));
const PostNewJob = Loadable(lazy(() => import('views/Employer/PostNewJob')));
const MyJobs = Loadable(lazy(() => import('views/Employer/MyJobs')));
const JobDetails = Loadable(lazy(() => import('views/Employer/JobDetails')));
const EditJob = Loadable(lazy(() => import('views/Employer/EditJob')));
const Applicants = Loadable(lazy(() => import('views/Employer/Applicants')));
const Analytics = Loadable(lazy(() => import('views/Employer/Analytics')));
const MyProfile = Loadable(lazy(() => import('views/Employer/MyProfile')));
const Messages = Loadable(lazy(() => import('views/Employer/Messages')));

// ==============================|| EMPLOYER ROUTES ||============================== //

// Landing page with EmployerLayout (PublicNavbar)
const EmployerLandingRoute = {
  path: '/app/employer',
  element: <EmployerLayout />,
  children: [
    {
      path: '',
      element: <ProtectedRoute allowedRoles={['employer']}><Navigate to="/app/employer/landing" replace /></ProtectedRoute>
    },
    {
      path: 'landing',
      element: <ProtectedRoute allowedRoles={['employer']}><EmployerLanding /></ProtectedRoute>
    }
  ]
};

// Dashboard and other pages with MainLayout (Sidebar)
const EmployerDashboardRoutes = {
  path: '/app/employer',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      element: <ProtectedRoute allowedRoles={['employer']}><EmployerDashboard /></ProtectedRoute>
    },
    {
      path: 'post-job',
      element: <ProtectedRoute allowedRoles={['employer']}><PostNewJob /></ProtectedRoute>
    },
    {
      path: 'my-internship',
      element: <ProtectedRoute allowedRoles={['employer']}><MyJobs /></ProtectedRoute>
    },
    {
      path: 'internship/:id',
      element: <ProtectedRoute allowedRoles={['employer']}><JobDetails /></ProtectedRoute>
    },
    {
      path: 'internship/:id/edit',
      element: <ProtectedRoute allowedRoles={['employer']}><EditJob /></ProtectedRoute>
    },
    {
      path: 'applicants',
      element: <ProtectedRoute allowedRoles={['employer']}><Applicants /></ProtectedRoute>
    },
    {
      path: 'analytics',
      element: <ProtectedRoute allowedRoles={['employer']}><Analytics /></ProtectedRoute>
    },
    {
      path: 'profile',
      element: <ProtectedRoute allowedRoles={['employer']}><MyProfile /></ProtectedRoute>
    },
    {
      path: 'messages',
      element: <ProtectedRoute allowedRoles={['employer']}><Messages /></ProtectedRoute>
    }
  ]
};

export { EmployerLandingRoute, EmployerDashboardRoutes };
