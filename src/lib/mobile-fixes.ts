// Mobile WebView fixes for touch events and button interactions

export const addMobileTouchSupport = () => {
  if (typeof window === 'undefined') return;

  // Add touch support for buttons that might not be working
  const addTouchSupport = () => {
    // Find all buttons that might need touch support
    const buttons = document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]');
    
    buttons.forEach(button => {
      // Remove existing touch listeners to avoid duplicates
      button.removeEventListener('touchstart', handleTouchStart);
      button.removeEventListener('touchend', handleTouchEnd);
      
      // Add touch event listeners
      button.addEventListener('touchstart', handleTouchStart, { passive: true });
      button.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
  };

  const handleTouchStart = (e: Event) => {
    const button = e.target as HTMLElement;
    button.style.opacity = '0.8';
  };

  const handleTouchEnd = (e: Event) => {
    const button = e.target as HTMLElement;
    button.style.opacity = '1';
    
    // Prevent default and trigger click
    e.preventDefault();
    e.stopPropagation();
    
    // Small delay to ensure proper touch handling
    setTimeout(() => {
      button.click();
    }, 10);
  };

  // Run on page load
  addTouchSupport();

  // Run again after any dynamic content is added
  const observer = new MutationObserver(() => {
    addTouchSupport();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => {
    observer.disconnect();
  };
};

// Fix for form submissions in mobile WebViews
export const fixMobileFormSubmission = () => {
  if (typeof window === 'undefined') return;

  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Remove existing listeners
    form.removeEventListener('submit', handleMobileFormSubmit);
    
    // Add mobile-friendly form submission
    form.addEventListener('submit', handleMobileFormSubmit);
  });
};

const handleMobileFormSubmit = (e: Event) => {
  const form = e.target as HTMLFormElement;
  
  // Add a small delay to ensure proper handling in mobile WebView
  setTimeout(() => {
    // Trigger the original submit event
    const submitEvent = new Event('submit', {
      bubbles: true,
      cancelable: true
    });
    
    form.dispatchEvent(submitEvent);
  }, 50);
};

// Fix for input focus issues in mobile WebViews
export const fixMobileInputFocus = () => {
  if (typeof window === 'undefined') return;

  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      // Ensure the input is visible and properly focused
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
};

// Main function to apply all mobile fixes
export const applyMobileFixes = () => {
  if (typeof window === 'undefined') return;

  // Apply fixes when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addMobileTouchSupport();
      fixMobileFormSubmission();
      fixMobileInputFocus();
    });
  } else {
    addMobileTouchSupport();
    fixMobileFormSubmission();
    fixMobileInputFocus();
  }
};
