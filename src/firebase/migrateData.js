import { addBlogPost } from './blogService.js';
import blogData from '../data/blogPosts.json';

export const migrateDataToFirebase = async () => {
  try {
    console.log('Starting migration to Firebase...');
    
    for (const post of blogData.posts) {
      await addBlogPost({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags,
        readTime: post.readTime,
        published: post.published,
        date: post.date
      });
      console.log(`Migrated: ${post.title}`);
    }
    
    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};