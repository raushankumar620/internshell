// Shared image management service
// This service manages images that are shared across different pages
import React from 'react';

class ImageService {
  constructor() {
    // Initialize with default images
    this.images = {
      hero: [
        { id: 1, url: '/home4.png', title: 'Hero Image 1', category: 'hero' },
        { id: 2, url: '/home3.png', title: 'Hero Image 2', category: 'hero' },
        { id: 3, url: '/home2.png', title: 'Hero Image 3', category: 'hero' }
      ],
      blog: [
        { 
          id: 4, 
          url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 
          title: 'Internship Success Tips', 
          category: 'blog' 
        },
        { 
          id: 5, 
          url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 
          title: 'Professional Networking', 
          category: 'blog' 
        },
        { 
          id: 6, 
          url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 
          title: 'Remote Work Excellence', 
          category: 'blog' 
        },
        {
          id: 7,
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          title: 'Professional Impact',
          category: 'blog'
        },
        {
          id: 8,
          url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          title: 'Future Technology',
          category: 'blog'
        },
        {
          id: 9,
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          title: 'Virtual Interviews',
          category: 'blog'
        }
      ],
      about: [
        { 
          id: 10, 
          url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 
          title: 'Team Collaboration', 
          category: 'about' 
        },
        { 
          id: 11, 
          url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 
          title: 'Innovation Hub', 
          category: 'about' 
        },
        {
          id: 12,
          url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          title: 'Modern Workspace',
          category: 'about'
        }
      ]
    };

    // Load from localStorage if available
    this.loadFromStorage();
    
    // Set up event listeners for cross-component communication
    this.subscribers = [];
  }

  // Load images from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('sharedImages');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.images = { ...this.images, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load images from storage:', error);
    }
  }

  // Save images to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('sharedImages', JSON.stringify(this.images));
      this.notifySubscribers();
    } catch (error) {
      console.warn('Failed to save images to storage:', error);
    }
  }

  // Subscribe to image updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers of changes
  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.images));
  }

  // Get all images
  getAllImages() {
    return { ...this.images };
  }

  // Get images by category
  getImagesByCategory(category) {
    return this.images[category] || [];
  }

  // Get single image by ID
  getImageById(id) {
    for (const category of Object.values(this.images)) {
      const image = category.find(img => img.id === id);
      if (image) return image;
    }
    return null;
  }

  // Add new image
  addImage(imageData) {
    const { category } = imageData;
    if (!this.images[category]) {
      this.images[category] = [];
    }

    // Generate new ID
    const allImages = Object.values(this.images).flat();
    const maxId = Math.max(...allImages.map(img => img.id), 0);
    const newImage = { ...imageData, id: maxId + 1 };

    this.images[category].push(newImage);
    this.saveToStorage();
    
    return newImage;
  }

  // Update existing image
  updateImage(id, updates) {
    for (const category in this.images) {
      const imageIndex = this.images[category].findIndex(img => img.id === id);
      if (imageIndex !== -1) {
        this.images[category][imageIndex] = {
          ...this.images[category][imageIndex],
          ...updates
        };
        this.saveToStorage();
        return this.images[category][imageIndex];
      }
    }
    return null;
  }

  // Delete image
  deleteImage(id) {
    for (const category in this.images) {
      const imageIndex = this.images[category].findIndex(img => img.id === id);
      if (imageIndex !== -1) {
        const deletedImage = this.images[category].splice(imageIndex, 1)[0];
        this.saveToStorage();
        return deletedImage;
      }
    }
    return null;
  }

  // Get random image from category
  getRandomImage(category) {
    const categoryImages = this.getImagesByCategory(category);
    if (categoryImages.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    return categoryImages[randomIndex];
  }

  // Get featured images (first image from each category)
  getFeaturedImages() {
    const featured = {};
    for (const category in this.images) {
      if (this.images[category].length > 0) {
        featured[category] = this.images[category][0];
      }
    }
    return featured;
  }

  // Search images by title or category
  searchImages(query, category = null) {
    const searchTerms = query.toLowerCase().split(' ');
    let imagesToSearch = [];

    if (category) {
      imagesToSearch = this.getImagesByCategory(category);
    } else {
      imagesToSearch = Object.values(this.images).flat();
    }

    return imagesToSearch.filter(image => {
      const searchText = `${image.title} ${image.category}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });
  }

  // Get image statistics
  getStatistics() {
    const stats = {
      total: 0,
      byCategory: {}
    };

    for (const category in this.images) {
      const count = this.images[category].length;
      stats.byCategory[category] = count;
      stats.total += count;
    }

    return stats;
  }

  // Bulk import images
  bulkImport(images) {
    const imported = [];
    const failed = [];

    images.forEach(imageData => {
      try {
        const newImage = this.addImage(imageData);
        imported.push(newImage);
      } catch (error) {
        failed.push({ imageData, error: error.message });
      }
    });

    return { imported, failed };
  }

  // Export all images
  exportImages() {
    return {
      timestamp: new Date().toISOString(),
      images: this.images
    };
  }

  // Reset to default images
  reset() {
    localStorage.removeItem('sharedImages');
    this.loadFromStorage();
    this.notifySubscribers();
  }
}

// Create singleton instance
const imageService = new ImageService();

// React hook for using image service
export const useImageService = () => {
  const [images, setImages] = React.useState(imageService.getAllImages());

  React.useEffect(() => {
    const unsubscribe = imageService.subscribe(setImages);
    return unsubscribe;
  }, []);

  return {
    images,
    imageService,
    // Convenience methods
    getImagesByCategory: imageService.getImagesByCategory.bind(imageService),
    addImage: imageService.addImage.bind(imageService),
    updateImage: imageService.updateImage.bind(imageService),
    deleteImage: imageService.deleteImage.bind(imageService),
    getRandomImage: imageService.getRandomImage.bind(imageService),
    searchImages: imageService.searchImages.bind(imageService)
  };
};

export default imageService;