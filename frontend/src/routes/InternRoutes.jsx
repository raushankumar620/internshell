import React, { lazy } from 'react';

// project import
import InternLayout from 'layout/InternLayout';
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import ProtectedRoute from 'component/ProtectedRoute';

// Intern Pages
const InternLanding = Loadable(lazy(() => import('views/Intern/Landing')));
const ApplyJob = Loadable(lazy(() => import('views/Intern/ApplyJob')));
const MyProfile = Loadable(lazy(() => import('views/Intern/MyProfile')));
const Dashboard = Loadable(lazy(() => import('views/Intern/Dashboard')));
const AppliedJobs = Loadable(lazy(() => import('views/Intern/AppliedJobs')));
const Messages = Loadable(lazy(() => import('views/Intern/Messages')));
const ATSChecker = Loadable(lazy(() => import('views/Intern/ATSChecker')));
const ResumeBuilder = Loadable(lazy(() => import('views/Intern/ResumeBuilder')));

// ==============================|| INTERN ROUTES ||============================== //

const InternRoutes = {
  path: '/app/intern',
  children: [
    {
      path: '',
      element: <InternLayout />,
      children: [
        {
          path: '',
          element: <ProtectedRoute allowedRoles={['intern']}><InternLanding /></ProtectedRoute>
        },
        {
          path: 'landing',
          element: <ProtectedRoute allowedRoles={['intern']}><InternLanding /></ProtectedRoute>
        },
        {
          path: 'apply/:id',
          element: <ProtectedRoute allowedRoles={['intern']}><ApplyJob /></ProtectedRoute>
        }
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: 'dashboard',
          element: <ProtectedRoute allowedRoles={['intern']}><Dashboard /></ProtectedRoute>
        },
        {
          path: 'profile',
          element: <ProtectedRoute allowedRoles={['intern']}><MyProfile /></ProtectedRoute>
        },
        {
          path: 'applied-jobs',
          element: <ProtectedRoute allowedRoles={['intern']}><AppliedJobs /></ProtectedRoute>
        },
        {
          path: 'resume-builder',
          element: <ProtectedRoute allowedRoles={['intern']}><ResumeBuilder /></ProtectedRoute>
        },
        {
          path: 'ats-checker',
          element: <ProtectedRoute allowedRoles={['intern']}><ATSChecker /></ProtectedRoute>
        },
        {
          path: 'messages',
          element: <ProtectedRoute allowedRoles={['intern']}><Messages /></ProtectedRoute>
        }
      ]
    }
  ]
};

export default InternRoutes;