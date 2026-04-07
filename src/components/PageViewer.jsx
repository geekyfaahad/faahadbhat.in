import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPageBySlug, fetchFileContent } from '../firebase/pageService.js';

export const PageViewer = ({ slug }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const loadPage = async () => {
            try {
                setLoading(true);
                const page = await getPageBySlug(slug);

                if (!page) {
                    setError('notfound');
                    return;
                }

                // Find the index.html file
                const indexFile = page.files.find(f =>
                    f.path === 'index.html' || f.path.endsWith('/index.html')
                );

                if (!indexFile) {
                    setError('noindex');
                    return;
                }

                // Fetch the HTML content
                let html = await fetchFileContent(indexFile.url);

                // Build a map of file paths to their Firebase Storage URLs
                const fileUrlMap = {};
                page.files.forEach(f => {
                    fileUrlMap[f.path] = f.url;
                    // Also map without leading directory
                    const baseName = f.path.split('/').pop();
                    if (baseName) fileUrlMap[baseName] = f.url;
                });

                // Rewrite relative URLs in the HTML to point to Firebase Storage
                // Handle src="..." and href="..." attributes
                html = html.replace(
                    /(src|href)=["'](?!http|https|data:|mailto:|tel:|#|\/\/)([^"']+)["']/gi,
                    (match, attr, path) => {
                        // Clean path
                        const cleanPath = path.replace(/^\.\//, '');
                        const url = fileUrlMap[cleanPath];
                        if (url) {
                            return `${attr}="${url}"`;
                        }
                        return match;
                    }
                );

                // Also rewrite url() in inline styles
                html = html.replace(
                    /url\(["']?(?!http|https|data:)([^"')]+)["']?\)/gi,
                    (match, path) => {
                        const cleanPath = path.replace(/^\.\//, '');
                        const url = fileUrlMap[cleanPath];
                        if (url) {
                            return `url("${url}")`;
                        }
                        return match;
                    }
                );

                setHtmlContent(html);
            } catch (err) {
                console.error('Error loading page:', err);
                setError('error');
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [slug]);

    // ── Loading State ──
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0e141b] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
                    <p className="text-gray-400">Loading page...</p>
                </div>
            </div>
        );
    }

    // ── 404 State ──
    if (error === 'notfound') {
        return (
            <div className="min-h-screen bg-[#0e141b] text-white flex items-center justify-center p-5">
                <div className="text-center space-y-6 max-w-md">
                    <div className="text-7xl">🔍</div>
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="text-gray-400 text-lg">
                        The page <span className="text-purple-400 font-medium">/{slug}</span> doesn't exist.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-all"
                    >
                        ← Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // ── No index.html State ──
    if (error === 'noindex') {
        return (
            <div className="min-h-screen bg-[#0e141b] text-white flex items-center justify-center p-5">
                <div className="text-center space-y-6 max-w-md">
                    <div className="text-7xl">⚠️</div>
                    <h1 className="text-2xl font-bold">Missing index.html</h1>
                    <p className="text-gray-400">
                        This page was uploaded without an index.html file and cannot be displayed.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all"
                    >
                        ← Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // ── Error State ──
    if (error) {
        return (
            <div className="min-h-screen bg-[#0e141b] text-white flex items-center justify-center p-5">
                <div className="text-center space-y-6 max-w-md">
                    <div className="text-7xl">❌</div>
                    <h1 className="text-2xl font-bold">Something went wrong</h1>
                    <p className="text-gray-400">Failed to load this page. Please try again later.</p>
                    <Link
                        href="/"
                        className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all"
                    >
                        ← Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // ── Render the uploaded HTML in a sandboxed iframe ──
    return (
        <iframe
            srcDoc={htmlContent}
            title={slug}
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            style={{
                width: '100vw',
                height: '100vh',
                border: 'none',
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        />
    );
};
