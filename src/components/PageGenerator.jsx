import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import { getAllPages } from '../firebase/pageService.js';

// Server-side password — in production this is validated by Netlify Function
// For local dev, we validate against this hardcoded value or env var
const VALID_PASSWORD = 'faahad-page-gen-2026';

const getMimeType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
        'html': 'text/html',
        'htm': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon',
        'webp': 'image/webp',
        'woff': 'font/woff',
        'woff2': 'font/woff2',
        'ttf': 'font/ttf',
        'eot': 'application/vnd.ms-fontobject',
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'pdf': 'application/pdf',
        'xml': 'application/xml',
        'txt': 'text/plain',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

export const PageGenerator = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [slug, setSlug] = useState('');
    const [zipFile, setZipFile] = useState(null);
    const [extractedFiles, setExtractedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState('');

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const loadPages = useCallback(async () => {
        try {
            setLoading(true);
            const allPages = await getAllPages();
            setPages(allPages);
        } catch (err) {
            console.error('Error loading pages:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadPages();
        }
    }, [isAuthenticated, loadPages]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === VALID_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
            showNotification('✅ Authentication successful!');
        } else {
            setError('Invalid password. Access denied.');
        }
    };

    const handleSlugChange = (e) => {
        // Allow alphanumeric, hyphens, and underscores only
        const value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '');
        setSlug(value);
    };

    const processZipFile = async (file) => {
        if (!file || !file.name.endsWith('.zip')) {
            setError('Please upload a valid .zip file');
            return;
        }

        try {
            setZipFile(file);
            const zip = await JSZip.loadAsync(file);
            const files = [];

            for (const [path, zipEntry] of Object.entries(zip.files)) {
                if (!zipEntry.dir) {
                    // Skip macOS metadata files
                    if (path.startsWith('__MACOSX/') || path.startsWith('.')) continue;

                    const content = await zipEntry.async('uint8array');
                    files.push({
                        path: path,
                        content: content,
                        type: getMimeType(path),
                        size: content.length
                    });
                }
            }

            setExtractedFiles(files);
            setError('');

            const hasIndex = files.some(f =>
                f.path === 'index.html' || f.path.endsWith('/index.html')
            );
            if (!hasIndex) {
                setError('Warning: No index.html found in the ZIP. The page may not render correctly.');
            }
        } catch (err) {
            console.error('Error processing ZIP:', err);
            setError('Failed to process ZIP file. Make sure it is a valid ZIP archive.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processZipFile(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        processZipFile(file);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleUpload = async () => {
        if (!slug.trim()) {
            setError('Please enter a page slug');
            return;
        }
        if (extractedFiles.length === 0) {
            setError('Please upload a ZIP file first');
            return;
        }

        try {
            setUploading(true);
            setUploadProgress('Creating page...');

            // Remove common root folder from paths if all files share one
            let files = [...extractedFiles];
            const paths = files.map(f => f.path);
            const firstSegments = paths.map(p => p.split('/')[0]);
            const commonRoot = firstSegments[0];
            const allShareRoot = firstSegments.every(s => s === commonRoot) && paths.every(p => p.includes('/'));

            if (allShareRoot) {
                files = files.map(f => ({
                    ...f,
                    path: f.path.substring(commonRoot.length + 1)
                }));
            }

            setUploadProgress(`Uploading ${files.length} files to server...`);
            const payload = {
                slug,
                files: files.map((f) => ({
                    ...f,
                    content: Array.from(f.content)
                }))
            };
            const response = await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to create page');
            }

            setUploadProgress('');
            showNotification(`✅ Page "${slug}" created successfully! Visit /${slug} to view it.`);

            // Reset form
            setSlug('');
            setZipFile(null);
            setExtractedFiles([]);
            setError('');

            // Reload pages
            await loadPages();
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
    };

    const handleDeletePage = async (pageId, pageSlug) => {
        if (!window.confirm(`Are you sure you want to delete the page "/${pageSlug}"? This cannot be undone.`)) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/pages/${pageId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: pageSlug })
            });
            if (!response.ok) {
                throw new Error('Failed to delete page');
            }
            showNotification(`✅ Page "/${pageSlug}" deleted successfully.`);
            await loadPages();
        } catch (err) {
            console.error('Delete error:', err);
            showNotification(`❌ Failed to delete page: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (type) => {
        if (type.includes('html')) return '📄';
        if (type.includes('css')) return '🎨';
        if (type.includes('javascript')) return '⚡';
        if (type.includes('image')) return '🖼️';
        if (type.includes('font')) return '🔤';
        if (type.includes('json')) return '📋';
        return '📎';
    };

    // ── Password Gate ──
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0e141b] text-white flex items-center justify-center p-5">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                            ← Back to Portfolio
                        </Link>
                        <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Page Generator
                        </h1>
                        <p className="text-gray-400 mt-2">Enter the server password to continue</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                                placeholder="Enter server password"
                                autoFocus
                                required
                            />
                        </div>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                        >
                            Unlock
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── Main Admin UI ──
    return (
        <div className="min-h-screen bg-[#0e141b] text-white">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 max-w-md px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border transition-all animate-pulse ${notification.type === 'error'
                        ? 'bg-red-500/20 border-red-500/30 text-red-300'
                        : 'bg-green-500/20 border-green-500/30 text-green-300'
                    }`}>
                    <div className="flex items-center justify-between">
                        <span>{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="ml-4 hover:text-white">×</button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="border-b border-white/5 bg-white/[0.02] backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                                ← Back
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Page Generator
                                </h1>
                                <p className="text-xs text-gray-500 mt-0.5">Upload ZIP → Create custom URL</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setIsAuthenticated(false); setPassword(''); }}
                            className="text-gray-500 hover:text-red-400 transition-colors text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/30"
                        >
                            Lock
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

                {/* Create New Page Section */}
                <section className="border border-white/5 rounded-2xl bg-white/[0.02] p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-white">Create New Page</h2>

                    {/* Slug Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Page Slug
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">faahadbhat.in/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={handleSlugChange}
                                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all text-white"
                                placeholder="Clean-Sweep"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">Only letters, numbers, hyphens, and underscores</p>
                    </div>

                    {/* Drag & Drop Zone */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Upload ZIP File
                        </label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${isDragging
                                    ? 'border-purple-500 bg-purple-500/10 scale-[1.01]'
                                    : zipFile
                                        ? 'border-green-500/40 bg-green-500/5'
                                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                }`}
                            onClick={() => document.getElementById('zip-input').click()}
                        >
                            <input
                                id="zip-input"
                                type="file"
                                accept=".zip"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {zipFile ? (
                                <div className="space-y-2">
                                    <div className="text-4xl">📦</div>
                                    <p className="text-green-400 font-medium">{zipFile.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(zipFile.size)} • {extractedFiles.length} files</p>
                                    <p className="text-xs text-gray-600">Click or drag to replace</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="text-5xl opacity-30">📁</div>
                                    <p className="text-gray-400">
                                        <span className="text-purple-400 font-medium">Drop your ZIP file here</span>
                                        <br />
                                        <span className="text-xs text-gray-500">or click to browse</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Extracted Files Preview */}
                    {extractedFiles.length > 0 && (
                        <div className="border border-white/5 rounded-xl overflow-hidden">
                            <div className="bg-white/[0.03] px-4 py-2.5 border-b border-white/5">
                                <h3 className="text-sm font-medium text-gray-300">Files in ZIP ({extractedFiles.length})</h3>
                            </div>
                            <div className="max-h-48 overflow-y-auto divide-y divide-white/5">
                                {extractedFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-2 text-sm hover:bg-white/[0.02]">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span>{getFileIcon(file.type)}</span>
                                            <span className="text-gray-300 truncate">{file.path}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 ml-3 flex-shrink-0">{formatFileSize(file.size)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Upload Progress */}
                    {uploadProgress && (
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3 text-purple-300 text-sm flex items-center gap-3">
                            <div className="animate-spin h-4 w-4 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                            {uploadProgress}
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !slug.trim() || extractedFiles.length === 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 disabled:shadow-none"
                    >
                        {uploading ? 'Uploading...' : `Create /${slug || '...'}`}
                    </button>
                </section>

                {/* Existing Pages */}
                <section className="border border-white/5 rounded-2xl bg-white/[0.02] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Your Pages ({pages.length})</h2>
                        <button
                            onClick={loadPages}
                            disabled={loading}
                            className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {pages.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <div className="text-4xl mb-3 opacity-30">📭</div>
                            <p>No pages created yet</p>
                            <p className="text-xs mt-1">Upload a ZIP file above to create your first page</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pages.map((page) => (
                                <div key={page.id} className="flex items-center justify-between border border-white/5 rounded-xl px-4 py-3 hover:bg-white/[0.02] transition-colors group">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-purple-400 font-medium">/{page.slug}</span>
                                            <span className="text-xs text-gray-600">
                                                {page.files?.length || 0} files
                                            </span>
                                        </div>
                                        {page.createdAt && (
                                            <p className="text-xs text-gray-600 mt-0.5">
                                                Created {page.createdAt.toDate().toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`/${page.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                                        >
                                            Visit
                                        </a>
                                        <button
                                            onClick={() => handleDeletePage(page.id, page.slug)}
                                            disabled={loading}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
