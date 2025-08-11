import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './config.js';

// Admin login with email and password
export const loginAdmin = async (email, password) => {
  try {
    console.log('Attempting admin login...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Admin login successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Admin login error:', error);
    let errorMessage = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Logout admin
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    console.log('Admin logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Get current auth state
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Create admin account (for initial setup)
export const createAdminAccount = async (email, password) => {
  try {
    console.log('Creating admin account...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Admin account created successfully:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Create admin account error:', error);
    let errorMessage = 'Failed to create admin account.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Use at least 6 characters.';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
}; 