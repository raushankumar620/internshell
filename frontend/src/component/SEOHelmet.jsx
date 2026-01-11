import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for dynamic page meta tags
 * 
 * Usage:
 * <SEOHelmet 
 *   title="Page Title"
 *   description="Page description"
 *   keywords="keyword1, keyword2"
 *   canonical="https://internshell.com/page"
 *   ogImage="https://internshell.com/image.jpg"
 * />
 */

const SEOHelmet = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://internshell.com/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  author = 'Internshell',
  noindex = false,
  structuredData = null
}) => {
  const fullTitle = title ? `${title} | Internshell` : 'Internshell - Find Your Perfectjobs Opportunity';
  const defaultDescription = 'Connect withjobs opportunities and build your career. India\'s leadingjobs platform.';
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="Internshell" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <meta name="twitter:creator" content="@internshell" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHelmet;
