import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  getAllBlogPosts, 
} from '../firebase/blogService.js';
import { migrateDataToFirebase } from '../firebase/migrateData.js';
import { loginAdmin, logoutAdmin, onAuthStateChange, getCurrentUser } from '../firebase/authService.js';
const RichTextEditor = dynamic(() => import('./RichTextEditor.jsx'), { ssr: false });

const createPostServer = async (postData) => {
  const res = await fetch('/api/blog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
};

const updatePostServer = async (postId, postData) => {
  const res = await fetch(`/api/blog/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
};

const deletePostServer = async (postId) => {
  const res = await fetch(`/api/blog/${postId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
};

const togglePublishServer = async (postId, published) => {
  const res = await fetch(`/api/blog/${postId}/publish`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ published })
  });
  if (!res.ok) throw new Error('Failed to toggle publish state');
  return res.json();
};

export const BlogAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    published: true
  });

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        console.log('User authenticated:', user.email);
        setIsAuthenticated(true);
        setCurrentUser(user);
        loadPosts(); // Load posts when authenticated
      } else {
        console.log('User not authenticated');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getAllBlogPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      setNotificationMessage('❌ Error loading posts. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setNotificationMessage('❌ Please enter both email and password.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      return;
    }

    try {
      setLoading(true);
      const result = await loginAdmin(email, password);
      
      if (result.success) {
        setNotificationMessage('✅ Login successful!');
        setEmail('');
        setPassword('');
      } else {
        setNotificationMessage(`❌ ${result.error}`);
      }
      
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error('Login error:', error);
      setNotificationMessage('❌ Login failed. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const result = await logoutAdmin();
      
      if (result.success) {
        setNotificationMessage('✅ Logged out successfully!');
        setEditingPost(null);
        setShowForm(false);
      } else {
        setNotificationMessage(`❌ ${result.error}`);
      }
      
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error('Logout error:', error);
      setNotificationMessage('❌ Logout failed. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Calculate read time based on content length
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      

      
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        readTime: calculateReadTime(formData.content.replace(/<[^>]*>/g, '')),
        published: formData.published,
        date: editingPost ? editingPost.date : new Date().toISOString().split('T')[0]
      };

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - Check Firebase security rules or internet connection')), 5000);
      });

      let savePromise;
      if (editingPost) {
        // Update existing post
        savePromise = updatePostServer(editingPost.id, postData);
      } else {
        // Add new post
        savePromise = createPostServer(postData);
      }

      // Race between save operation and timeout
      await Promise.race([savePromise, timeoutPromise]);

      if (editingPost) {
        setNotificationMessage('✅ Post updated successfully!');
      } else {
        setNotificationMessage('✅ Post created successfully!');
      }

      // Reload posts
      await loadPosts();

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        published: true
      });
      setEditingPost(null);
      setShowForm(false);

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);

    } catch (error) {
      console.error('Error saving post:', error);
      let errorMessage = '❌ Error saving post. Please try again.';
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        errorMessage = '❌ Permission denied. Please check Firebase security rules.';
      } else if (error.code === 'unavailable') {
        errorMessage = '❌ Firebase service unavailable. Please check your internet connection.';
      } else if (error.code === 'unauthenticated') {
        errorMessage = '❌ Authentication required. Please check Firebase configuration.';
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 8000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      published: post.published
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true);
        await deletePostServer(postId);
        await loadPosts();
        setNotificationMessage('✅ Post deleted successfully!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      } catch (error) {
        console.error('Error deleting post:', error);
        setNotificationMessage('❌ Error deleting post. Please try again.');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTogglePublish = async (postId) => {
    try {
      setLoading(true);
      const post = posts.find(p => p.id === postId);
      const newPublishedStatus = !post.published;
      await togglePublishServer(postId, newPublishedStatus);
      await loadPosts();
      setNotificationMessage(`✅ Post ${newPublishedStatus ? 'published' : 'unpublished'} successfully!`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setNotificationMessage('❌ Error updating publish status. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    await loadPosts();
    setNotificationMessage('✅ Posts refreshed successfully!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleMigration = async () => {
    if (window.confirm('This will migrate existing JSON data to Firebase. Continue?')) {
      try {
        setLoading(true);
        await migrateDataToFirebase();
        await loadPosts();
        setNotificationMessage('✅ Data migrated to Firebase successfully!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      } catch (error) {
        console.error('Migration error:', error);
        setNotificationMessage('❌ Migration failed. Please try again.');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      } finally {
        setLoading(false);
      }
    }
  };



  if (authLoading) {
    return (
      <>
        <Helmet>
          <title>Blog Admin - Faahad Bhat</title>
        </Helmet>
        <div className="min-h-screen bg-[#0e141b] text-white flex items-center justify-center p-5">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p className="text-gray-400">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Blog Admin - Faahad Bhat</title>
        </Helmet>
        <div className="min-h-screen bg-[#0e141b] text-white flex items-center justify-center p-5">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                ← Back to Portfolio
              </Link>
              <h1 className="text-2xl font-bold mt-4">Blog Admin</h1>
              <p className="text-gray-400 mt-2">Sign in with your admin credentials</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/blog/admin/create" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Need to create an admin account?
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog Admin - Faahad Bhat</title>
      </Helmet>
             <div className="min-h-screen bg-[#0e141b] text-white">
         {/* Notification */}
         {showNotification && (
           <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
             <div className="flex items-center justify-between">
               <span>{notificationMessage}</span>
               <button
                 onClick={() => setShowNotification(false)}
                 className="ml-4 text-white hover:text-gray-200"
               >
                 ×
               </button>
             </div>
           </div>
         )}
         
         {/* Header */}
         <header className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
                             <div className="flex items-center gap-6">
                <Link href="/" className="text-xl font-semibold hover:text-gray-300 transition-colors">
                   ← Back to Portfolio
                 </Link>
                 <div>
                   <h1 className="text-2xl font-bold">Blog Admin</h1>
                   {currentUser && (
                     <p className="text-sm text-gray-400">Signed in as {currentUser.email}</p>
                   )}
                 </div>
               </div>
                             <div className="flex items-center gap-4">
                 <button
                   onClick={refreshPosts}
                   disabled={loading}
                   className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
                 >
                   {loading ? 'Loading...' : 'Refresh'}
                 </button>
                 <button
                   onClick={handleMigration}
                   disabled={loading}
                   className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-4 py-2 rounded-lg transition-colors"
                 >
                   {loading ? 'Migrating...' : 'Migrate Data'}
                 </button>
                                   <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    {loading ? 'Signing out...' : 'Sign Out'}
                  </button>
               </div>
            </div>
          </div>
        </header>

                 {/* Main Content */}
         <main className="max-w-6xl mx-auto px-6 py-8">
           {/* Instructions */}
           <div className="mb-8 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
             <h3 className="text-lg font-semibold mb-2 text-green-300">🚀 Firebase Database Connected</h3>
             <p className="text-sm text-gray-300 mb-2">
               Your blog is now powered by Firebase Firestore! All changes are automatically saved to the cloud.
             </p>
             <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
               <li>✅ Real-time data synchronization</li>
               <li>✅ Automatic cloud backup</li>
               <li>✅ No manual file management required</li>
               <li>✅ Instant updates across all devices</li>
             </ul>
           </div>
           
           {/* Add New Post Button */}
           <div className="mb-8">
            <button
                             onClick={() => {
                 setShowForm(true);
                 setEditingPost(null);
                 setFormData({
                   title: '',
                   excerpt: '',
                   content: '',
                   tags: '',
                   published: true
                 });
               }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              + Add New Post
            </button>
          </div>

          {/* Blog Post Form */}
          {showForm && (
            <div className="mb-8 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingPost ? 'Edit Post' : 'Add New Post'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                                 <div>
                   <label className="block text-sm font-medium mb-2">Title</label>
                   <input
                     type="text"
                     name="title"
                     value={formData.title}
                     onChange={handleInputChange}
                     className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                     required
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium mb-2">Content</label>
                   <RichTextEditor
                     value={formData.content}
                     onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                     placeholder="Start writing your blog post content..."
                   />
                   {formData.content && (
                     <p className="text-sm text-gray-400 mt-2">
                       Estimated read time: {calculateReadTime(formData.content.replace(/<[^>]*>/g, ''))}
                     </p>
                   )}
                 </div>
                
                                 <div>
                   <label className="block text-sm font-medium mb-2">Excerpt</label>
                   <textarea
                     name="excerpt"
                     value={formData.excerpt}
                     onChange={handleInputChange}
                     rows="3"
                     className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                     required
                   />
                 </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                    placeholder="e.g., React, JavaScript, Web Development"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span>Published</span>
                  </label>
                </div>
                
                                 <div className="flex gap-4">
                   <button
                     type="submit"
                     disabled={loading}
                     className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-6 py-2 rounded-lg transition-colors"
                   >
                     {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                   </button>
                   <button
                     type="button"
                     disabled={loading}
                     onClick={() => {
                       setShowForm(false);
                       setEditingPost(null);
                     }}
                     className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 px-6 py-2 rounded-lg transition-colors"
                   >
                     Cancel
                   </button>
                 </div>
              </form>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">All Posts ({posts.length})</h2>
            {posts.map((post) => (
              <div key={post.id} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        post.published 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                      <span>{post.tags.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePublish(post.id)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        post.published 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}; 