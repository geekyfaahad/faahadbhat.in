import React from 'react';

export const SocialLink = ({ href, icon, label, target = "_blank" }) => {
  return (
    <a 
      href={href} 
      target={target}
      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-200"
    >
      {icon}
      {label}
    </a>
  );
};