import React from 'react';
import { SEOHead } from './SEOHead';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { EmailIcon } from './icons/EmailIcon';
import { BlogIcon } from './icons/BlogIcon';
import { LocationIcon } from './icons/LocationIcon';
import Link from 'next/link';

const DEVICON = (path) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}.svg`;
const SI = (slug, color) =>
  color
    ? `https://cdn.simpleicons.org/${slug}/${color}`
    : `https://cdn.simpleicons.org/${slug}`;

const TECH_STACK_ROWS = [
  {
    title: 'Frontend',
    items: [
      { label: 'React', src: DEVICON('react/react-original') },
      { label: 'Next.js', src: DEVICON('nextjs/nextjs-original') },
      { label: 'TypeScript', src: DEVICON('typescript/typescript-original') },
      { label: 'Tailwind', src: DEVICON('tailwindcss/tailwindcss-original') },
    ],
  },
  {
    title: 'Backend',
    items: [
      { label: 'Python', src: DEVICON('python/python-original') },
      { label: 'Flask', src: DEVICON('flask/flask-original') },
      { label: 'Django', src: DEVICON('django/django-plain') },
      { label: 'FastAPI', src: DEVICON('fastapi/fastapi-original') },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { label: 'Docker', src: DEVICON('docker/docker-original') },
      { label: 'PostgreSQL', src: DEVICON('postgresql/postgresql-original') },
      { label: 'Redis', src: DEVICON('redis/redis-original') },
      {
        label: 'Vercel',
        src: SI('vercel', 'FFFFFF'),
      },
    ],
  },
  {
    title: 'AI / APIs',
    items: [
      { label: 'OpenAI', src: 'https://openai.com/favicon.ico' },
      { label: 'Gemini', src: SI('googlegemini', '8E75FF') },
      {
        label: 'RAG Systems',
        src: SI('langchain', 'FFFFFF'),
        title: 'RAG — retrieval-augmented generation (e.g. LangChain-style stacks)',
      },
    ],
  },
];

const TechBadge = ({ label, src, title: titleAttr }) => (
  <span
    title={titleAttr ?? label}
    className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-gray-200 text-xs sm:text-sm"
  >
    <img
      src={src}
      alt=""
      width={22}
      height={22}
      className="h-5 w-5 sm:h-6 sm:w-6 object-contain shrink-0"
      loading="lazy"
      decoding="async"
    />
    <span className="font-medium">{label}</span>
  </span>
);

export const HomePage = () => {
  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-gradient-to-b from-[#0a1626] via-[#0e141b] to-[#0e141b] text-white font-inter flex items-center justify-center p-5">
        <div className="text-center max-w-4xl w-full">
          <img 
            src="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" 
            alt="Portrait of Faahad Bhat" 
            className="w-32 h-32 rounded-full object-cover mb-4 mx-auto grayscale-0 transition-all duration-300" 
          />
          
          <h1 className="text-xl font-semibold">Faahad Bhat</h1>
          
          <p className="text-gray-400 text-sm mt-2 mb-4 flex items-center justify-center gap-1">
            <LocationIcon />
            Kashmir
          </p>
          
          <p className="text-gray-300 text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            Full-Stack Developer building scalable SaaS platforms, AI-powered systems, and high-performance APIs.
            Experienced with React, Next.js, Python, and cloud infrastructure, building products used by real users.
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300">
              <p className="text-xl font-semibold">15+</p>
              <p className="text-xs text-gray-400">Web apps built</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300">
              <p className="text-xl font-semibold">3</p>
              <p className="text-xs text-gray-400">Production SaaS systems</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300">
              <p className="text-xl font-semibold">100k+</p>
              <p className="text-xs text-gray-400">API requests processed</p>
            </div>
          </div>

          {/* What I Build */}
          <div className="mb-10 text-left bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-3 text-white text-center">What I Build</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
              <p>• SaaS platforms</p>
              <p>• AI-powered applications</p>
              <p>• High-performance APIs</p>
              <p>• Developer tools</p>
              <p>• Automation systems</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-10 text-left bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 text-white text-center">Tech Stack</h2>
            <div className="space-y-5 text-sm">
              {TECH_STACK_ROWS.map((row) => (
                <div key={row.title}>
                  <p className="text-white font-medium mb-2">{row.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {row.items.map((item) => (
                      <TechBadge
                        key={item.label}
                        label={item.label}
                        src={item.src}
                        title={item.title}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Focus */}
          <div className="mb-10 text-left bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-3 text-white text-center">Engineering Focus</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
              <p>• Scalable API design</p>
              <p>• Async processing pipelines</p>
              <p>• Distributed systems thinking</p>
              <p>• AI integrations and RAG systems</p>
              <p>• Multi-tenant SaaS architecture</p>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-white">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/30 text-left h-full flex flex-col">
                <h3 className="text-sm font-semibold text-white mb-1">Awaaz</h3>
                <p className="text-xs text-gray-400 mb-2">Async News Aggregator</p>
                <p className="text-xs text-gray-300 mb-2">Python • FastAPI • React • Redis</p>
                <p className="text-xs text-gray-400 mb-3">RSS aggregation, article extraction, async processing, summarization</p>
                <div className="mt-auto flex gap-2">
                  <a href="https://awaaz-news.vercel.app" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors">Live Demo</a>
                  <a href="https://github.com/geekyfaahad/awaaz" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Source Code</a>
                </div>
              </div>

              <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/30 text-left h-full flex flex-col">
                <h3 className="text-sm font-semibold text-white mb-1">Travel CRM</h3>
                <p className="text-xs text-gray-400 mb-2">Multi-tenant SaaS</p>
                <p className="text-xs text-gray-300 mb-2">Next.js • PostgreSQL • Redis</p>
                <p className="text-xs text-gray-400 mb-3">Auth, role management, booking workflows, tenant isolation</p>
                <div className="mt-auto flex gap-2">
                  <a href="https://yaamtravelcrm.com" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors">Live Demo</a>
                  <a href="https://github.com/geekyfaahad" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Source Code</a>
                </div>
              </div>

              <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/30 text-left h-full flex flex-col">
                <h3 className="text-sm font-semibold text-white mb-1">AI Fact News Checker</h3>
                <p className="text-xs text-gray-400 mb-2">RAG-based AI app</p>
                <p className="text-xs text-gray-300 mb-2">OpenAI • Gemini • Vector DB • NextJS</p>
                <p className="text-xs text-gray-400 mb-3">Semantic search, embeddings, long-form AI summarization</p>
                <div className="mt-auto flex gap-2">
                  <a href="https://awaaz-rag.vercel.app" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors">Live Demo</a>
                  <a href="https://github.com/geekyfaahad" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Source Code</a>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub and Writing */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <a
              href="https://github.com/geekyfaahad"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors hover:shadow-lg"
            >
              <h3 className="text-sm font-semibold text-white mb-1">GitHub Activity</h3>
              <p className="text-xs text-gray-400 mb-3">Top languages, streaks, and contribution activity</p>
              <div className="space-y-2 text-xs">
                <a href="https://github.com/geekyfaahad?tab=repositories" target="_blank" rel="noopener noreferrer" className="block text-blue-300 hover:text-blue-200">View Public Repositories</a>
                <a href="https://github.com/geekyfaahad?tab=stars" target="_blank" rel="noopener noreferrer" className="block text-blue-300 hover:text-blue-200">View Starred Projects</a>
                <a href="https://github.com/geekyfaahad" target="_blank" rel="noopener noreferrer" className="block text-blue-300 hover:text-blue-200">View Contribution Activity</a>
              </div>
            </a>
            <Link
              href="/blog"
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors hover:shadow-lg"
            >
              <h3 className="text-sm font-semibold text-white mb-1">Writing & Blog</h3>
              <p className="text-xs text-gray-400 mb-2">Recent technical writing</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Building an Async News Aggregator with FastAPI</li>
                <li>• Designing a Multi-Tenant SaaS Architecture</li>
                <li>• How RAG Systems Work in Production</li>
              </ul>
            </Link>
          </div>

          {/* Currently Building */}
          <div className="mb-10 text-left bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-3 text-white text-center">Currently Building</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
              <p>• AI-powered developer tools</p>
              <p>• Advanced RAG pipelines</p>
              <p>• Scalable SaaS platforms</p>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-wrap justify-center gap-3 text-sm mb-10">
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 text-white px-4 py-2 rounded-full transition-all duration-200"
            >
              Contact Me
            </a>
            <a
              href="https://github.com/geekyfaahad"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/geekyfaahad/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
            <a
              href="mailto:geekyfaahad@gmail.com"
              className="bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200"
            >
              <EmailIcon />
              Email
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 text-white px-4 py-2 rounded-full transition-all duration-200"
            >
              Download Resume (PDF)
            </a>
            <Link
              href="/blog"
              className="bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200"
            >
              <BlogIcon />
              Blog
            </Link>
          </div>

          {/* Contact */}
          <div id="contact" className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-2">Let's Build Something</h2>
            <p className="text-sm text-gray-400 mb-4">
              If you want to collaborate or hire me for a project, reach out directly.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <a href="mailto:geekyfaahad@gmail.com" className="text-blue-300 hover:text-blue-200">geekyfaahad@gmail.com</a>
              <span className="text-gray-600">•</span>
              <a href="https://github.com/geekyfaahad" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">GitHub</a>
              <span className="text-gray-600">•</span>
              <a href="https://www.linkedin.com/in/geekyfaahad/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">LinkedIn</a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Outside of coding, I enjoy exploring AI systems, reading about distributed architectures, and building experimental developer tools.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}; 