// Utility function to force scroll to top
export const scrollToTop = (force = true) => {
  try {
    // Method 1: Direct window scroll (immediate)
    window.scrollTo(0, 0);
    
    // Method 2: Document element scroll
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
    }
    
    // Method 3: Body scroll
    if (document.body) {
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
    }
    
    // Method 4: Check for any scrollable parent containers
    const scrollableElements = document.querySelectorAll('[data-scrollable], .scrollable, .overflow-auto, .overflow-y-auto');
    scrollableElements.forEach(el => {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    });
    
    // Method 5: Force with requestAnimationFrame if needed
    if (force && (window.pageYOffset !== 0 || document.documentElement.scrollTop !== 0)) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        });
      });
    }
    
    // Method 6: Use setTimeout as backup for persistent issues
    setTimeout(() => {
      if (window.pageYOffset !== 0 || document.documentElement.scrollTop !== 0) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    }, 10);
    
    // Method 7: Force reset any CSS transforms that might affect positioning
    if (force) {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.style.transform = 'none';
        rootElement.style.transition = 'none';
      }
    }
    
  } catch (error) {
    console.warn('Scroll to top failed:', error);
  }
};

// Function to ensure page loads from top
export const ensurePageStartsFromTop = () => {
  // Immediately set scroll to top before any rendering
  scrollToTop(true);
  
  // Disable scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  // Handle page load events
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scrollToTop(true));
  } else {
    scrollToTop(true);
  }
  
  window.addEventListener('load', () => scrollToTop(true));
  
  // Handle back/forward navigation
  window.addEventListener('popstate', () => scrollToTop(true));
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '' || window.location.hash === '#') {
      scrollToTop(true);
    }
  });
  
  // Handle focus changes (when user comes back to tab)
  window.addEventListener('focus', () => scrollToTop(false));
  
  // Prevent any saved scroll position restoration
  if (window.history && window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
  }
};

export default scrollToTop;