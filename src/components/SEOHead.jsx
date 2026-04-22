import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = () => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Faahad Bhat — Full Stack Developer | React, Python, AI Systems</title>
      <meta name="description" content="Portfolio of Faahad Bhat, full-stack developer specializing in SaaS platforms, AI integrations, and scalable web applications using React, Next.js, and Python." />
      <meta name="keywords" content="Full Stack Developer, Python Developer, React Developer, Flask, Django, JavaScript, Web Development, Kashmir, India, Geeky Faahad, Faahad Bhat" />
      <meta name="author" content="Faahad Bhat" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Theme and Mobile Meta Tags */}
      <meta name="theme-color" content="#0e141b" />
      <meta name="msapplication-TileColor" content="#0e141b" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://faahadbhat.in" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
      <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Additional Meta Tags for Better SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Geeky Faahad Portfolio" />
      <meta name="apple-mobile-web-app-title" content="Geeky Faahad" />
      
      {/* Language and Region */}
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="IN-JK" />
      <meta name="geo.placename" content="Kashmir, India" />
      
      {/* Additional Open Graph Tags */}
      <meta property="og:image:alt" content="Portrait of Faahad Bhat - Full Stack Developer" />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:secure_url" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
      
      {/* Additional Twitter Tags */}
      <meta name="twitter:image:alt" content="Portrait of Faahad Bhat - Full Stack Developer" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://geekyfaahad.netlify.app/" />
      <meta property="og:title" content="Faahad Bhat — Full Stack Developer | React, Python, AI Systems" />
      <meta property="og:description" content="Portfolio of Faahad Bhat, full-stack developer specializing in SaaS platforms, AI integrations, and scalable web applications using React, Next.js, and Python." />
      <meta property="og:image" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Geeky Faahad Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://faahadbhat.in" />
      <meta name="twitter:title" content="Faahad Bhat — Full Stack Developer | React, Python, AI Systems" />
      <meta name="twitter:description" content="Portfolio of Faahad Bhat, full-stack developer specializing in SaaS platforms, AI integrations, and scalable web applications using React, Next.js, and Python." />
      <meta name="twitter:image" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
      <meta name="twitter:creator" content="@faahadbhat" />
      <meta name="twitter:site" content="@faahadbhat" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Faahad Bhat",
          "alternateName": "Geeky Faahad",
          "jobTitle": "Full Stack Developer",
          "description": "Full-Stack Developer specializing in SaaS platforms, AI integrations, and scalable web applications with React, Next.js, and Python.",
          "url": "https://faahadbhat.in/",
          "image": "https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp",
          "sameAs": [
            "https://twitter.com/faahadbhat",
            "https://instagram.com/geekyfaahad",
            "https://www.linkedin.com/in/geekyfaahad/",
            "https://github.com/geekyfaahad"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kashmir",
            "addressCountry": "IN"
          },
          "knowsAbout": [
            "Python",
            "JavaScript",
            "React",
            "Flask",
            "Django",
            "Full Stack Development",
            "RESTful APIs",
            "Authentication Systems",
            "Web Development",
            "Automation"
          ],
          "worksFor": {
            "@type": "Organization",
            "name": "Yaam Web Solutions"
          },
          "knowsLanguage": ["English", "Hindi", "Kashmiri"],
          "nationality": "Indian"
        })}
      </script>
    </Helmet>
  );
}; 