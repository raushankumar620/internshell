import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import MainLayout from 'layout/MainLayout';
import InternLayout from 'layout/InternLayout';
import Loadable from 'component/Loadable';
import ProtectedRoute from 'component/ProtectedRoute';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));

// Employer Pages
const PostNewJob = Loadable(lazy(() => import('views/Employer/PostNewJob')));
const MyJobs = Loadable(lazy(() => import('views/Employer/MyJobs')));
const JobDetails = Loadable(lazy(() => import('views/Employer/JobDetails')));
const EditJob = Loadable(lazy(() => import('views/Employer/EditJob')));
const Applicants = Loadable(lazy(() => import('views/Employer/Applicants')));
const Analytics = Loadable(lazy(() => import('views/Employer/Analytics')));
const MyProfile = Loadable(lazy(() => import('views/Employer/MyProfile')));
const Messages = Loadable(lazy(() => import('views/Employer/Messages')));

// Intern Pages
const InternDashboard = Loadable(lazy(() => import('views/Intern/Dashboard')));
const AppliedJobs = Loadable(lazy(() => import('views/Intern/AppliedJobs')));
const InternProfile = Loadable(lazy(() => import('views/Intern/MyProfile')));
const ResumeBuilder = Loadable(lazy(() => import('views/Intern/ResumeBuilder')));
const ATSChecker = Loadable(lazy(() => import('views/Intern/ATSChecker')));
const ApplyJob = Loadable(lazy(() => import('views/Intern/ApplyJob')));
const InternMessages = Loadable(lazy(() => import('views/Intern/Messages')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/app',
  element: <MainLayout />,
  children: [
    {
      path: '/app/dashboard',
      element: <ProtectedRoute allowedRoles={['employer']}><DashboardDefault /></ProtectedRoute>
    },
    {
      path: '/app/dashboard/default',
      element: <ProtectedRoute allowedRoles={['employer']}><DashboardDefault /></ProtectedRoute>
    },
    { path: '/app/utils/util-typography', element: <UtilsTypography /> },
    
    // Employer Routes (Protected - Only Employers)
    { 
      path: '/app/employer/dashboard', 
      element: <ProtectedRoute allowedRoles={['employer']}><DashboardDefault /></ProtectedRoute>
    },
    { 
      path: '/app/employer/post-job', 
      element: <ProtectedRoute allowedRoles={['employer']}><PostNewJob /></ProtectedRoute>
    },
    { 
      path: '/app/employer/my-internship', 
      element: <ProtectedRoute allowedRoles={['employer']}><MyJobs /></ProtectedRoute>
    },
    { 
      path: '/app/employer/internship/:id', 
      element: <ProtectedRoute allowedRoles={['employer']}><JobDetails /></ProtectedRoute>
    },
    { 
      path: '/app/employer/internship/:id/edit', 
      element: <ProtectedRoute allowedRoles={['employer']}><EditJob /></ProtectedRoute>
    },
    { 
      path: '/app/employer/applicants', 
      element: <ProtectedRoute allowedRoles={['employer']}><Applicants /></ProtectedRoute>
    },
    { 
      path: '/app/employer/analytics', 
      element: <ProtectedRoute allowedRoles={['employer']}><Analytics /></ProtectedRoute>
    },
    { 
      path: '/app/employer/profile', 
      element: <ProtectedRoute allowedRoles={['employer']}><MyProfile /></ProtectedRoute>
    },
    { 
      path: '/app/employer/messages', 
      element: <ProtectedRoute allowedRoles={['employer']}><Messages /></ProtectedRoute>
    },
    
    // Intern Routes (Protected - Only Interns)
    { 
      path: '/app/intern/dashboard', 
      element: <ProtectedRoute allowedRoles={['intern']}><InternDashboard /></ProtectedRoute>
    },
    { 
      path: '/app/intern/applied-internship', 
      element: <ProtectedRoute allowedRoles={['intern']}><AppliedJobs /></ProtectedRoute>
    },
    { 
      path: '/app/intern/profile', 
      element: <ProtectedRoute allowedRoles={['intern']}><InternProfile /></ProtectedRoute>
    },
    { 
      path: '/app/intern/resume-builder', 
      element: <ProtectedRoute allowedRoles={['intern']}><ResumeBuilder /></ProtectedRoute>
    },
    { 
      path: '/app/intern/ats-checker', 
      element: <ProtectedRoute allowedRoles={['intern']}><ATSChecker /></ProtectedRoute>
    },
    { 
      path: '/app/intern/apply-job/:id', 
      element: <ProtectedRoute allowedRoles={['intern']}><ApplyJob /></ProtectedRoute>
    },
    { 
      path: '/app/intern/messages', 
      element: <ProtectedRoute allowedRoles={['intern']}><InternMessages /></ProtectedRoute>
    }
  ]
};

export default MainRoutes;