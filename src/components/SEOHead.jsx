import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = () => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>Faahad Bhat (Geeky Faahad) - Full Stack Developer</title>
      <meta name="description" content="Full Stack Developer specializing in Python (Flask, Django) and JavaScript (React). Expert in secure authentication systems, RESTful APIs, and automation. Based in Kashmir, India." />
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
      <link rel="icon" type="image/png" href="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.png" sizes="16x16" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://geekyfaahad.netlify.app/" />
      <meta property="og:title" content="Faahad Bhat (Geeky Faahad) - Full Stack Developer" />
      <meta property="og:description" content="Full Stack Developer specializing in Python (Flask, Django) and JavaScript (React). Expert in secure authentication systems, RESTful APIs, and automation." />
      <meta property="og:image" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Geeky Faahad Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://faahadbhat.in" />
      <meta name="twitter:title" content="Faahad Bhat (Geeky Faahad) - Full Stack Developer" />
      <meta name="twitter:description" content="Full Stack Developer specializing in Python (Flask, Django) and JavaScript (React). Expert in secure authentication systems, RESTful APIs, and automation." />
      <meta name="twitter:image" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
      <meta name="twitter:creator" content="@faahadbhat" />
      <meta name="twitter:site" content="@faahadbhat" />
      
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Faahad Bhat",
          "alternateName": "Geeky Faahad",
          "jobTitle": "Full Stack Developer",
          "description": "A highly skilled Full-Stack Developer experienced in building performant web applications with Python (Flask, Django) and JavaScript (React). Expert in secure authentication systems, RESTful APIs, and automation.",
          "url": "https://geekyfaahad.netlify.app/",
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
      
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Geeky Faahad Portfolio",
          "url": "https://geekyfaahad.netlify.app/",
          "description": "Personal portfolio of Faahad Bhat, a Full Stack Developer specializing in Python and JavaScript development.",
          "author": {
            "@type": "Person",
            "name": "Faahad Bhat"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://geekyfaahad.netlify.app/?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
}; 