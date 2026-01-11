import React from 'react';
import { Outlet } from 'react-router-dom';
import { scrollToTop } from '../../utils/scrollToTop';

// ==============================|| PUBLIC PAGE LAYOUT ||============================== //

const PublicPageLayout = () => {
  // Ensure scroll is at top when layout mounts
  React.useEffect(() => {
    scrollToTop(true);
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default PublicPageLayout;