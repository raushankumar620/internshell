import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicFooter from 'component/PublicFooter';
import { scrollToTop } from '../../utils/scrollToTop';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
  // Ensure scroll is at top when layout mounts
  React.useEffect(() => {
    scrollToTop(true);
  }, []);

  return (
    <>
      <Outlet />
      <PublicFooter />
    </>
  );
};

export default MinimalLayout;