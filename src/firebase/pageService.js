import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll
} from 'firebase/storage';
import { db, storage } from './config.js';

const PAGES_COLLECTION = 'pages';

// Upload files to Firebase Storage under pages/{slug}/
export const uploadPageFiles = async (slug, files) => {
    const uploadedFiles = [];

    for (const file of files) {
        const storageRef = ref(storage, `pages/${slug}/${file.path}`);
        const blob = new Blob([file.content], { type: file.type || 'application/octet-stream' });
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        uploadedFiles.push({
            path: file.path,
            url: downloadURL,
            type: file.type,
            size: file.content.byteLength || file.content.length
        });
    }

    return uploadedFiles;
};

// Create a page record in Firestore
export const createPage = async (slug, files) => {
    try {
        // Check if slug already exists
        const existing = await getPageBySlug(slug);
        if (existing) {
            throw new Error(`A page with slug "${slug}" already exists.`);
        }

        // Upload files to storage
        const uploadedFiles = await uploadPageFiles(slug, files);

        // Create Firestore document
        const docRef = await addDoc(collection(db, PAGES_COLLECTION), {
            slug: slug,
            files: uploadedFiles,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { id: docRef.id, slug, files: uploadedFiles };
    } catch (error) {
        console.error('Error creating page:', error);
        throw error;
    }
};

// Get page by slug
export const getPageBySlug = async (slug) => {
    try {
        const q = query(
            collection(db, PAGES_COLLECTION),
            where('slug', '==', slug)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        // If permission denied, treat as not found (public viewer context)
        if (error.code === 'permission-denied') {
            console.warn('Firestore permission denied for pages collection. Returning null.');
            return null;
        }
        console.error('Error getting page by slug:', error);
        throw error;
    }
};

// Get all pages
export const getAllPages = async () => {
    try {
        const q = query(collection(db, PAGES_COLLECTION));
        const querySnapshot = await getDocs(q);
        const pages = [];
        querySnapshot.forEach((doc) => {
            pages.push({ id: doc.id, ...doc.data() });
        });
        // Sort by createdAt descending
        pages.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return b.createdAt.toDate() - a.createdAt.toDate();
            }
            return 0;
        });
        return pages;
    } catch (error) {
        console.error('Error getting all pages:', error);
        throw error;
    }
};

// Delete a page and its files from storage
export const deletePage = async (pageId, slug) => {
    try {
        // Delete all files from storage
        const storageRef = ref(storage, `pages/${slug}`);
        try {
            const fileList = await listAll(storageRef);
            const deletePromises = fileList.items.map(item => deleteObject(item));
            await Promise.all(deletePromises);

            // Also delete files in subdirectories
            for (const prefix of fileList.prefixes) {
                const subFiles = await listAll(prefix);
                const subDeletePromises = subFiles.items.map(item => deleteObject(item));
                await Promise.all(subDeletePromises);
            }
        } catch (storageError) {
            console.warn('Some storage files could not be deleted:', storageError);
        }

        // Delete Firestore document
        const pageRef = doc(db, PAGES_COLLECTION, pageId);
        await deleteDoc(pageRef);

        return pageId;
    } catch (error) {
        console.error('Error deleting page:', error);
        throw error;
    }
};

// Fetch file content from Firebase Storage URL
export const fetchFileContent = async (url) => {
    try {
        const response = await fetch(url);
        return await response.text();
    } catch (error) {
        console.error('Error fetching file content:', error);
        throw error;
    }
};
