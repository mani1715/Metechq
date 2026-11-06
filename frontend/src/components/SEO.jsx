import { useEffect } from 'react';

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData
}) => {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
    }

    const setMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta tags
    if (description) setMetaTag('description', description);
    if (keywords) setMetaTag('keywords', keywords);

    // OpenGraph
    if (ogType) setMetaTag('og:type', ogType, true);
    if (ogTitle || title) setMetaTag('og:title', ogTitle || title, true);
    if (ogDescription || description) setMetaTag('og:description', ogDescription || description, true);
    if (ogImage) setMetaTag('og:image', ogImage, true);
    if (ogUrl || canonical) setMetaTag('og:url', ogUrl || canonical, true);

    // Twitter
    if (twitterCard) setMetaTag('twitter:card', twitterCard);
    if (twitterTitle || ogTitle || title) setMetaTag('twitter:title', twitterTitle || ogTitle || title);
    if (twitterDescription || ogDescription || description) setMetaTag('twitter:description', twitterDescription || ogDescription || description);
    if (twitterImage || ogImage) setMetaTag('twitter:image', twitterImage || ogImage);

    // Canonical link
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonical);
    }

    // Structured data JSON-LD
    let scriptElement = null;
    if (structuredData) {
      scriptElement = document.querySelector('script[data-seo-jsonld="true"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        scriptElement.setAttribute('data-seo-jsonld', 'true');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = typeof structuredData === 'string' ? structuredData : JSON.stringify(structuredData);
    }

    return () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [
    title,
    description,
    keywords,
    canonical,
    ogType,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    structuredData
  ]);

  return null;
};

export default SEO;
