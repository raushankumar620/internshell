import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from 'component/PublicNavbar';
import PublicFooter from 'component/PublicFooter';
import { scrollToTop } from '../../utils/scrollToTop';

// ==============================|| EMPLOYER LAYOUT ||============================== //

const EmployerLayout = () => {
  // Ensure scroll is at top when layout mounts
  React.useEffect(() => {
    scrollToTop(true);
  }, []);

  return (
    <>
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
    </>
  );
};

export default EmployerLayout;
