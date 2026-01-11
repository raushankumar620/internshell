// Fix for Material-UI TextField Floating Label Overlap Issue
// This script ensures proper floating label behavior across all TextField components

(function() {
  'use strict';

  // Function to fix floating labels
  function fixFloatingLabels() {
    // Get all MUI TextField input elements
    const inputs = document.querySelectorAll('.MuiOutlinedInput-input');
    
    inputs.forEach(input => {
      const formControl = input.closest('.MuiFormControl-root');
      const label = formControl?.querySelector('.MuiInputLabel-root');
      
      if (!label) return;
      
      // Check if input has value
      const hasValue = input.value && input.value.trim() !== '';
      
      // Force label to shrink if input has value
      if (hasValue) {
        label.classList.add('MuiInputLabel-shrink');
        label.classList.add('Mui-focused');
        
        // Apply proper styling
        label.style.transform = 'translate(14px, -9px) scale(0.75)';
        label.style.background = 'white';
        label.style.padding = '0 6px';
        label.style.zIndex = '2';
      } else {
        // Reset label if no value
        if (!input.matches(':focus')) {
          label.classList.remove('MuiInputLabel-shrink');
          label.classList.remove('Mui-focused');
          label.style.transform = '';
          label.style.background = '';
          label.style.padding = '';
        }
      }
    });
  }

  // Function to add event listeners to inputs
  function addEventListeners() {
    const inputs = document.querySelectorAll('.MuiOutlinedInput-input');
    
    inputs.forEach(input => {
      // Remove existing listeners to avoid duplicates
      input.removeEventListener('input', fixFloatingLabels);
      input.removeEventListener('focus', fixFloatingLabels);
      input.removeEventListener('blur', fixFloatingLabels);
      
      // Add event listeners
      input.addEventListener('input', fixFloatingLabels);
      input.addEventListener('focus', function() {
        const formControl = this.closest('.MuiFormControl-root');
        const label = formControl?.querySelector('.MuiInputLabel-root');
        if (label) {
          label.classList.add('MuiInputLabel-shrink');
          label.classList.add('Mui-focused');
          label.style.transform = 'translate(14px, -9px) scale(0.75)';
          label.style.background = 'white';
          label.style.padding = '0 6px';
          label.style.zIndex = '2';
        }
      });
      input.addEventListener('blur', function() {
        setTimeout(() => fixFloatingLabels(), 100);
      });
    });
  }

  // Function to handle different background colors
  function handleBackgroundColors() {
    const grayBackgroundInputs = document.querySelectorAll('[style*="background-color: rgb(245, 245, 245)"] .MuiOutlinedInput-input, [style*="bgcolor: #f5f5f5"] .MuiOutlinedInput-input');
    
    grayBackgroundInputs.forEach(input => {
      const formControl = input.closest('.MuiFormControl-root');
      const label = formControl?.querySelector('.MuiInputLabel-root');
      
      if (label && label.classList.contains('MuiInputLabel-shrink')) {
        label.style.background = 'rgba(245, 245, 245, 1)';
      }
    });
  }

  // Function to initialize the fix
  function initializeFloatingLabelFix() {
    fixFloatingLabels();
    addEventListeners();
    handleBackgroundColors();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFloatingLabelFix);
  } else {
    initializeFloatingLabelFix();
  }

  // Re-run fix when new content is added (for React components)
  const observer = new MutationObserver(function(mutations) {
    let shouldRerun = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.querySelector && (
              node.querySelector('.MuiTextField-root') ||
              node.classList?.contains('MuiTextField-root') ||
              node.querySelector('.MuiFormControl-root')
            )) {
              shouldRerun = true;
            }
          }
        });
      }
    });
    
    if (shouldRerun) {
      setTimeout(() => {
        initializeFloatingLabelFix();
      }, 100);
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also run fix on window load and resize
  window.addEventListener('load', initializeFloatingLabelFix);
  window.addEventListener('resize', initializeFloatingLabelFix);

  // Expose function globally for manual triggering if needed
  window.fixMUIFloatingLabels = initializeFloatingLabelFix;

})();