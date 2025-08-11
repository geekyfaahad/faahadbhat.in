import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { getBlogPostById } from '../firebase/blogService.js';

export const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleContentClick = useCallback(async (e) => {
    // Handle copy button clicks in published posts
    if (e.target.classList.contains('copy-btn')) {
      e.preventDefault();
      e.stopPropagation();
      
      const button = e.target;
      const commandBlock = button.closest('.command-block');
      const preElement = commandBlock?.querySelector('pre');
      const commandText = preElement?.textContent || button.getAttribute('data-command-text');
      
      if (!commandText) {
        console.warn('No command text found to copy');
        return;
      }

      // Add loading state
      button.disabled = true;
      button.classList.add('opacity-50');
      
      try {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(commandText);
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = commandText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Success feedback with smooth animation
        const originalText = button.textContent;
        const originalClasses = button.className;
        
        button.textContent = 'Copied!';
        button.className = originalClasses
          .replace('text-blue-400', 'text-green-400')
          .replace('hover:text-blue-300', 'hover:text-green-300')
          .replace('opacity-50', '');
        
        // Add success animation
        button.style.transform = 'scale(1.1)';
        button.style.transition = 'all 0.2s ease-in-out';
        
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 200);
        
        setTimeout(() => {
          button.textContent = originalText;
          button.className = originalClasses;
          button.disabled = false;
        }, 1500);
        
      } catch (error) {
        console.error('Failed to copy text:', error);
        
        // Error feedback
        const originalClasses = button.className;
        button.textContent = 'Failed!';
        button.className = originalClasses
          .replace('text-blue-400', 'text-red-400')
          .replace('hover:text-blue-300', 'hover:text-red-300')
          .replace('opacity-50', '');
        
        setTimeout(() => {
          button.textContent = 'Copy';
          button.className = originalClasses;
          button.disabled = false;
        }, 1500);
      }
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPostById(id);
        if (!data) {
          setError('Post not found');
        } else {
          setPost(data);
        }
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0e141b] text-white font-inter">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/blog" className="text-xl font-semibold hover:text-gray-300 transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </header>

      {loading && (
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-gray-400 mt-4">Loading post...</p>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && post && (
        <>
          <Helmet>
            {/* Basic Meta Tags */}
            <title>{post.title} - Geeky Faahad</title>
            <meta name="description" content={post.excerpt || post.title} />
            <meta name="keywords" content={post.tags ? post.tags.join(', ') : 'blog, technology, programming'} />
            <meta name="author" content="Faahad Bhat" />
            
            {/* Canonical URL */}
            <link rel="canonical" href={`https://geekyfaahad.netlify.app/blog/${id}`} />
            
            {/* Open Graph Meta Tags for Social Media */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`https://geekyfaahad.netlify.app/blog/${id}`} />
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.excerpt || post.title} />
            <meta property="og:image" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Geeky Faahad Blog" />
            <meta property="og:locale" content="en_US" />
            <meta property="article:published_time" content={post.date} />
            <meta property="article:author" content="Faahad Bhat" />
            {post.tags && post.tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={`https://geekyfaahad.netlify.app/blog/${id}`} />
            <meta name="twitter:title" content={post.title} />
            <meta name="twitter:description" content={post.excerpt || post.title} />
            <meta name="twitter:image" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
            <meta name="twitter:creator" content="@faahadbhat" />
            <meta name="twitter:site" content="@faahadbhat" />
            
            {/* Additional Meta Tags for WhatsApp, Instagram, etc. */}
            <meta name="format-detection" content="telephone=no" />
            <meta name="theme-color" content="#0e141b" />
            
            {/* Schema.org Article Structured Data */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.excerpt || post.title,
                "image": "https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp",
                "author": {
                  "@type": "Person",
                  "name": "Faahad Bhat",
                  "alternateName": "Geeky Faahad"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Geeky Faahad Blog",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp"
                  }
                },
                "datePublished": post.date,
                "dateModified": post.date,
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://geekyfaahad.netlify.app/blog/${id}`
                },
                "keywords": post.tags ? post.tags.join(', ') : 'blog, technology, programming'
              })}
            </script>
          </Helmet>
          <main className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
              <span>{post.readTime}</span>
              <span>
                {post.date && new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <article className="rich-text-content">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="rich-text-content"
                onClick={handleContentClick}
              />
            </article>
          </main>
        </>
      )}
    </div>
  );
};

