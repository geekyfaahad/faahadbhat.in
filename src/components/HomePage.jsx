import React from 'react';
import { SEOHead } from './SEOHead';
import { SocialLink } from './SocialLink';
import { TwitterIcon } from './icons/TwitterIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { ChatGPTIcon } from './icons/ChatGPTIcon';
import { EmailIcon } from './icons/EmailIcon';
import { BlogIcon } from './icons/BlogIcon';
import { LocationIcon } from './icons/LocationIcon';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-[#0e141b] text-white font-inter flex items-center justify-center p-5">
        <div className="text-center max-w-xl">
          <img 
            src="https://res.cloudinary.com/dw1sh368y/image/upload/v1749547175/faahad_atkeve.webp" 
            alt="Portrait of Faahad Bhat" 
            className="w-32 h-32 rounded-full object-cover mb-4 mx-auto grayscale hover:grayscale-0 transition-all duration-300" 
          />
          
          <h1 className="text-xl font-semibold">Faahad Bhat</h1>
          
          <p className="text-gray-400 text-sm mt-2 mb-4 flex items-center justify-center gap-1">
            <LocationIcon />
            Kashmir
          </p>
          
          <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            A highly skilled Full-Stack Developer experienced in building performant web applications with Python (Flask, Django) and JavaScript (React). Expert in secure authentication systems, RESTful APIs, and automation. Known for precision, team collaboration, and end-to-end execution.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <SocialLink
              href="https://twitter.com/faahadbhat"
              icon={<TwitterIcon />}
              label="Twitter"
            />
            
            <SocialLink
              href="https://instagram.com/geekyfaahad"
              icon={<InstagramIcon />}
              label="Instagram"
            />
            
            <SocialLink
              href="https://www.linkedin.com/in/geekyfaahad/"
              icon={<LinkedInIcon />}
              label="LinkedIn"
            />
            
            <SocialLink
              href="https://github.com/geekyfaahad"
              icon={<GitHubIcon />}
              label="GitHub"
            />
            
            <SocialLink
              href="https://www.google.com/search?q=faahad+bhat+full+stack+developer"
              icon={<GoogleIcon />}
              label="Google"
            />
            
            <SocialLink
              href="https://chatgpt.com/?q=Geeky%20Faahad%20(Faahad%20Bhat)%20Srinagar%20Full%20Stack%20Developer%20Yaam%20Web%20Solutions&hints=search"
              icon={<ChatGPTIcon />}
              label="ChatGPT"
            />
            
            <SocialLink
              href="mailto:geekyfaahad@gmail.com"
              icon={<EmailIcon />}
              label="Email"
              target="_self"
            />
            
            <Link
              to="/blog"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-200"
            >
              <BlogIcon />
              Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}; 