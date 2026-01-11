// Shared constants for the application
import imageService from './services/imageService';

// Export the shared image service instance
export { default as imageService } from './services/imageService';

// Image categories
export const IMAGE_CATEGORIES = {
  HERO: 'hero',
  BLOG: 'blog',
  ABOUT: 'about'
};

// Default image fallbacks
export const DEFAULT_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  blog: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  about: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
};

// Theme constants
export const THEME_GRADIENTS = {
  primary: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  secondary: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
  success: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
  warning: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
  info: 'linear-gradient(45deg, #667eea, #764ba2)'
};

// Animation presets
export const ANIMATIONS = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  staggerChildren: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  hoverScale: {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.3 }
  }
};

// Blog categories
export const BLOG_CATEGORIES = [
  'All', 'Career Tips', 'Networking', 'Remote Work', 
  'Professional Development', 'Technology', 'Interview Tips'
];

// Application status types
export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYER: 'employer',
  INTERN: 'intern',
  USER: 'user'
};