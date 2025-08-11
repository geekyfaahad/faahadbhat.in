import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getPublishedBlogPosts, debugGetAllPosts } from '../firebase/blogService.js';

export const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPublishedPosts();
  }, []);

  const loadPublishedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading published blog posts...');
      const posts = await getPublishedBlogPosts();
      console.log('Loaded posts:', posts);
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const debugPosts = async () => {
    try {
      console.log('Debug: Checking all posts...');
      const allPosts = await debugGetAllPosts();
      console.log('All posts in database:', allPosts);
      alert(`Found ${allPosts.length} total posts. Check console for details.`);
    } catch (error) {
      console.error('Debug error:', error);
      alert('Debug failed. Check console for details.');
    }
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>Blog - Faahad Bhat (Geeky Faahad)</title>
        <meta name="description" content="Technical blog posts about web development, Python, React, and software engineering best practices." />
        <meta name="keywords" content="blog, web development, Python, React, JavaScript, software engineering, technology" />
        <meta name="author" content="Faahad Bhat" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://geekyfaahad.netlify.app/blog" />
        
        {/* Open Graph Meta Tags for Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://geekyfaahad.netlify.app/blog" />
        <meta property="og:title" content="Blog - Faahad Bhat (Geeky Faahad)" />
        <meta property="og:description" content="Technical blog posts about web development, Python, React, and software engineering best practices." />
        <meta property="og:image" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Geeky Faahad Blog" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://geekyfaahad.netlify.app/blog" />
        <meta name="twitter:title" content="Blog - Faahad Bhat (Geeky Faahad)" />
        <meta name="twitter:description" content="Technical blog posts about web development, Python, React, and software engineering best practices." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" />
        <meta name="twitter:creator" content="@faahadbhat" />
        <meta name="twitter:site" content="@faahadbhat" />
        
        {/* Additional Meta Tags for WhatsApp, Instagram, etc. */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#0e141b" />
        
        {/* Schema.org Blog Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Geeky Faahad Blog",
            "description": "Technical blog posts about web development, Python, React, and software engineering best practices.",
            "url": "https://geekyfaahad.netlify.app/blog",
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
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://geekyfaahad.netlify.app/blog"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-[#0e141b] text-white font-inter">
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-xl font-semibold hover:text-gray-300 transition-colors">
                ← Back to Portfolio
              </Link>
              <h1 className="text-2xl font-bold">Blog</h1>
            </div>
          </div>
        </header>

                 {/* Main Content */}
         <main className="max-w-4xl mx-auto px-6 py-12">
           <div className="mb-12">
             <h2 className="text-3xl font-bold mb-4">Latest Posts</h2>
             <p className="text-gray-400 text-lg">
               Thoughts on web development, software engineering, and technology.
             </p>
           </div>

           {/* Loading State */}
           {loading && (
             <div className="text-center py-12">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
               <p className="text-gray-400 mt-4">Loading posts...</p>
             </div>
           )}

           {/* Error State */}
           {error && (
             <div className="text-center py-12">
               <p className="text-red-400 mb-4">{error}</p>
               <div className="flex gap-4 justify-center">
                 <button
                   onClick={loadPublishedPosts}
                   className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                 >
                   Try Again
                 </button>
                 <button
                   onClick={debugPosts}
                   className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors"
                 >
                   Debug Posts
                 </button>
               </div>
             </div>
           )}

           {/* Blog Posts */}
           {!loading && !error && (
             <div className="space-y-8">
               {blogPosts.map((post) => (
                  <article key={post.id} className="border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
                   <div className="flex items-start justify-between mb-4">
                      <Link to={`/blog/${post.id}`} className="text-xl font-semibold hover:text-gray-300 transition-colors cursor-pointer">
                        {post.title}
                      </Link>
                     <span className="text-sm text-gray-500">{post.readTime}</span>
                   </div>
                   
                   <p className="text-gray-400 mb-4 leading-relaxed">
                     {post.excerpt}
                   </p>
                   
                   <div className="flex items-center justify-between">
                     <div className="flex flex-wrap gap-2">
                       {post.tags.map((tag) => (
                         <span 
                           key={tag} 
                           className="px-3 py-1 bg-white/10 text-sm rounded-full text-gray-300"
                         >
                           {tag}
                         </span>
                       ))}
                     </div>
                     
                     <div className="text-sm text-gray-500">
                       {new Date(post.date).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}
                     </div>
                   </div>
                 </article>
               ))}
             </div>
           )}

                       {/* Coming Soon */}
            {!loading && !error && (
              <div className="mt-16 text-center">
                <div className="border border-white/10 rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-2">More Posts Coming Soon</h3>
                  <p className="text-gray-400">
                    I'm working on more technical content. Stay tuned for updates on web development, 
                    Python, React, and software engineering best practices.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </>
    );
  }; 