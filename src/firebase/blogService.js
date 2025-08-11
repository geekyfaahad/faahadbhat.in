import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config.js';

const BLOG_COLLECTION = 'blogPosts';

// Get all blog posts
export const getAllBlogPosts = async () => {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return posts;
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};

// Get published blog posts only
export const getPublishedBlogPosts = async () => {
  try {
    console.log('Getting published blog posts...');
    
    // First try with date ordering
    try {
      const q = query(
        collection(db, BLOG_COLLECTION),
        where('published', '==', true),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log('Found', posts.length, 'published posts with date ordering');
      return posts;
    } catch (dateError) {
      console.log('Date ordering failed, trying without date ordering...');
      
      // If date ordering fails, try without it
      const q = query(
        collection(db, BLOG_COLLECTION),
        where('published', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort manually by date if available, otherwise by creation time
      posts.sort((a, b) => {
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      
      console.log('Found', posts.length, 'published posts without date ordering');
      return posts;
    }
  } catch (error) {
    console.error('Error getting published blog posts:', error);
    throw error;
  }
};

// Add new blog post
export const addBlogPost = async (postData) => {
  try {
    console.log('Attempting to add blog post:', postData);
    console.log('Collection name:', BLOG_COLLECTION);
    console.log('Firebase db instance:', db);
    
    // First, let's test if we can access the collection
    const testQuery = query(collection(db, BLOG_COLLECTION));
    console.log('Collection access test passed');
    
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Blog post added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding blog post:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    // Provide more specific error information
    if (error.code === 'permission-denied') {
      console.error('PERMISSION DENIED: Check Firebase security rules');
      console.error('Current rules might be too restrictive');
    } else if (error.code === 'unavailable') {
      console.error('SERVICE UNAVAILABLE: Check internet connection or Firebase service status');
    } else if (error.code === 'unauthenticated') {
      console.error('UNAUTHENTICATED: Firebase authentication required');
    }
    
    throw error;
  }
};

// Update blog post
export const updateBlogPost = async (postId, postData) => {
  try {
    const postRef = doc(db, BLOG_COLLECTION, postId);
    await updateDoc(postRef, {
      ...postData,
      updatedAt: serverTimestamp()
    });
    return postId;
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

// Delete blog post
export const deleteBlogPost = async (postId) => {
  try {
    const postRef = doc(db, BLOG_COLLECTION, postId);
    await deleteDoc(postRef);
    return postId;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Toggle publish status
export const togglePublishStatus = async (postId, published) => {
  try {
    const postRef = doc(db, BLOG_COLLECTION, postId);
    await updateDoc(postRef, {
      published,
      updatedAt: serverTimestamp()
    });
    return postId;
  } catch (error) {
    console.error('Error toggling publish status:', error);
    throw error;
  }
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    const testQuery = query(collection(db, BLOG_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(testQuery);
    console.log('Firebase connection successful. Found', querySnapshot.size, 'documents.');
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Test Firebase write permissions
export const testFirebaseWrite = async () => {
  try {
    console.log('Testing Firebase write permissions...');
    
    // Try to add a test document
    const testDoc = {
      title: 'Test Post',
      excerpt: 'This is a test post to verify write permissions',
      content: 'Test content',
      tags: ['test'],
      readTime: '1 min read',
      published: false,
      date: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), testDoc);
    console.log('Write test successful. Document ID:', docRef.id);
    
    // Clean up - delete the test document
    await deleteDoc(docRef);
    console.log('Test document cleaned up successfully');
    
    return true;
  } catch (error) {
    console.error('Firebase write test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return false;
  }
};

// Debug function to get all posts
export const debugGetAllPosts = async () => {
  try {
    console.log('Debug: Getting all posts...');
    const q = query(collection(db, BLOG_COLLECTION));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data
      });
      console.log('Post data:', { id: doc.id, ...data });
    });
    console.log('Total posts found:', posts.length);
    return posts;
  } catch (error) {
    console.error('Debug: Error getting all posts:', error);
    throw error;
  }
}; 

// Get a single blog post by ID
export const getBlogPostById = async (postId) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    const postRef = doc(db, BLOG_COLLECTION, postId);
    const snapshot = await getDoc(postRef);
    if (!snapshot.exists()) {
      return null;
    }
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('Error getting blog post by id:', error);
    throw error;
  }
};