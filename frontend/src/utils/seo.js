

export const updatePageSEO = ({ title, description, keywords, canonical, ogImage }) => {
  // Update title
  if (title) {
    document.title = `${title} | Internshell`;
  }

  // Update or create meta tags
  const updateMetaTag = (name, content, isProperty = false) => {
    if (!content) return;
    
    const attribute = isProperty ? 'property' : 'name';
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };
  // Update description
  updateMetaTag('description', description);
  
  // Update keywords
  updateMetaTag('keywords', keywords);
  
  // Update Open Graph tags
  updateMetaTag('og:title', title ? `${title} | Internshell` : null, true);
  updateMetaTag('og:description', description, true);
  updateMetaTag('og:image', ogImage, true);
  
  // Update Twitter tags
  updateMetaTag('twitter:title', title ? `${title} | Internshell` : null);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', ogImage);
  
  // Update canonical URL
  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }
};

/**
 * Page-specific SEO configurations
 */
export const SEO_CONFIG = {
  home: {
    title: 'Find Your Perfectjobs Opportunity',
    description: 'Internshell is India\'s leadingjobs platform connecting talented students with top employers. Findjobss in technology, marketing, design, finance & more.',
    keywords: 'internship in India, findjobss, studentjobs, summerjobs, paidjobs, techjobs',
    canonical: 'https://internshell.com/'
  },
  
 jobs: {
    title: 'Browsejobs Opportunities',
    description: 'Explore thousands ofjobs opportunities across various industries. Filter by location, stipend, duration and find your perfect match.',
    keywords: 'internshipjobs,jobs opportunities, remotejobs, work from homejobs, paidjobsjobs',
    canonical: 'https://internshell.com/internship'
  },
  
  about: {
    title: 'About Us - Connecting Students & Employers',
    description: 'Learn about Internshell\'s mission to bridge the gap between talented students and forward-thinking employers. Join India\'s fastest-growingjobs community.',
    keywords: 'about internshell,jobs platform, student career platform, employer solutions',
    canonical: 'https://internshell.com/about'
  },
  
  contact: {
    title: 'Contact Us - Get in Touch',
    description: 'Have questions? Get in touch with Internshell support team. We\'re here to help students and employers make the most of our platform.',
    keywords: 'contact internshell, support, help, customer service',
    canonical: 'https://internshell.com/contact'
  },
  
  employer: {
    postJob: {
      title: 'Postjobs - Hire Talented Interns',
      description: 'Post yourjobs openings and connect with skilled, motivated students. Simplify your hiring process with Internshell.',
      keywords: 'postjobs, hire interns, recruit students,jobs hiring',
      canonical: 'https://internshell.com/employer/post-job'
    },
    myinternship: {
      title: 'My Postedjobs - Managejobss',
      description: 'Manage yourjobs postings, review applications, and track hiring progress all in one place.',
      keywords: 'managejobss, job postings, applicant tracking',
      canonical: 'https://internshell.com/employer/my-internship'
    }
  },
  
  intern: {
    dashboard: {
      title: 'Student Dashboard - Track Your Applications',
      description: 'Track yourjobs applications, discover new opportunities, and manage your profile.',
      keywords: 'student dashboard,jobs applications, career tracking',
      canonical: 'https://internshell.com/intern/dashboard'
    },
    appliedinternship: {
      title: 'My Applications - Appliedjobss',
      description: 'View all yourjobs applications in one place. Track application status and follow up on opportunities.',
      keywords: 'appliedjobss, application status, job applications',
      canonical: 'https://internshell.com/intern/applied-internship'
    },
    atsChecker: {
      title: 'ATS Resume Checker - Optimize Your Resume',
      description: 'Check if your resume is ATS-friendly. Get instant feedback and improve your chances of getting shortlisted.',
      keywords: 'ATS checker, resume scanner, resume optimization, ATS-friendly resume',
      canonical: 'https://internshell.com/intern/ats-checker'
    }
  }
};

/**
 * Generate JSON-LD structured data for job postings
 */
export const generateJobPostingSchema = (job) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType || 'INTERN',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.companyName,
      sameAs: job.companyWebsite,
      logo: job.companyLogo
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'IN'
      }
    },
    baseSalary: job.stipend ? {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        value: job.stipend,
        unitText: 'MONTH'
      }
    } : undefined,
    qualifications: job.qualifications,
    skills: job.skills,
    workHours: job.workHours,
   jobstartDate: job.startDate
  };
};

/**
 * Inject structured data into page
 */
export const injectStructuredData = (data) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  
  // Remove existing structured data for this type
  const existing = document.querySelector(`script[type="application/ld+json"]`);
  if (existing && existing.text.includes(data['@type'])) {
    existing.remove();
  }
  
  document.head.appendChild(script);
};

/**
 * Breadcrumb structured data
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * FAQ structured data
 */
export const generateFAQSchema = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * React Hook for SEO
 */
export const useSEO = (config) => {
  React.useEffect(() => {
    if (config) {
      updatePageSEO(config);
    }
  }, [config]);
};

export default {
  updatePageSEO,
  SEO_CONFIG,
  generateJobPostingSchema,
  injectStructuredData,
  generateBreadcrumbSchema,
  generateFAQSchema,
  useSEO
};
