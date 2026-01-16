import React, { lazy } from 'react';

// project import
import Loadable from 'component/Loadable';
import GuestRoute from 'component/GuestRoute';
import MinimalLayout from 'layout/MinimalLayout';
import PublicPageLayout from 'layout/PublicPageLayout';

// pages
const LandingPage = Loadable(lazy(() => import('views/LandingPage')));
const Login = Loadable(lazy(() => import('views/Login')));
const Register = Loadable(lazy(() => import('views/Register')));
const AuthDemo = Loadable(lazy(() => import('views/AuthDemo')));
const VerifyEmail = Loadable(lazy(() => import('views/VerifyEmail')));
const ForgotPassword = Loadable(lazy(() => import('views/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('views/ResetPassword')));

// Public Pages
const AboutPage = Loadable(lazy(() => import('views/PublicPages/About')));
const JobsPage = Loadable(lazy(() => import('views/PublicPages/internship')));
const BlogPage = Loadable(lazy(() => import('views/PublicPages/Blog')));
const PricingPage = Loadable(lazy(() => import('views/PublicPages/Pricing')));

// ==============================|| AUTHENTICATION ROUTES ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <LandingPage />
    }
  ]
};

// Separate routes for auth pages without footer
const AuthPagesRoutes = {
  path: '/',
  element: <PublicPageLayout />,
  children: [
    {
      path: '/login',
      element: <GuestRoute><Login /></GuestRoute>
    },
    {
      path: '/register',
      element: <GuestRoute><Register /></GuestRoute>
    },
  ]
};

// Other auth routes that can use MinimalLayout
const OtherAuthRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/auth-demo',
      element: <GuestRoute><AuthDemo /></GuestRoute>
    },
    {
      path: '/verify-email',
      element: <GuestRoute><VerifyEmail /></GuestRoute>
    },
    {
      path: '/forgot-password',
      element: <GuestRoute><ForgotPassword /></GuestRoute>
    },
    {
      path: '/reset-password',
      element: <GuestRoute><ResetPassword /></GuestRoute>
    }
  ]
};

const PublicPageRoutes = {
  path: '/',
  element: <PublicPageLayout />,
  children: [
    {
      path: '/about',
      element: <AboutPage />
    },
    {
      path: '/internships',
      element: <JobsPage />
    },
    {
      path: '/blog',
      element: <BlogPage />
    },
    {
      path: '/pricing',
      element: <PricingPage />
    }
  ]
};

export { AuthenticationRoutes, AuthPagesRoutes, OtherAuthRoutes, PublicPageRoutes };
export default AuthenticationRoutes;