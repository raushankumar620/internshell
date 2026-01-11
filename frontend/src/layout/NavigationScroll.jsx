import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop, ensurePageStartsFromTop } from '../utils/scrollToTop';

// ==============================|| NAVIGATION SCROLL ||============================== //

const NavigationScroll = ({ children }) => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Force scroll to top on route change
    scrollToTop(true);
  }, [pathname]);

  // Ensure page starts from top on mount
  useEffect(() => {
    ensurePageStartsFromTop();
  }, []);

  return children || null;
};

NavigationScroll.propTypes = {
  children: PropTypes.node
};

export default NavigationScroll;
