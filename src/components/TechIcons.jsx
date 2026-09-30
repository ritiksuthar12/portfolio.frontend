import React from 'react';
import {
  Code,
  Server,
  Database,
  Cpu,
  Globe,
  Layers,
  Terminal,
  FileCode,
  Box,
  Braces
} from 'lucide-react';

export const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width="22" height="22">
    <circle cx="0" cy="0" r="2.05" fill="#00d8ff"/>
    <g stroke="#00d8ff" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

export const NodeIcon = () => (
  <svg viewBox="0 0 32 32" width="22" height="22">
    <path fill="#539E43" d="M16 2.5l11.5 6.6v13.8L16 29.5 4.5 22.9V9.1L16 2.5z"/>
    <path fill="#ffffff" d="M16 8.5l6.5 3.8v7.4L16 23.5l-6.5-3.8v-7.4L16 8.5z" opacity="0.3"/>
    <text x="16" y="19" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">JS</text>
  </svg>
);

export const MongoIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22">
    <path fill="#13aa52" d="M12 2C12 2 6 7 6 13c0 3.31 2.69 6 6 9 3.31-3 6-5.69 6-9 0-6-6-11-6-11z"/>
    <path fill="#116149" d="M12 2v20c3.31-3 6-5.69 6-9 0-6-6-11-6-11z" opacity="0.5"/>
    <path fill="#ffffff" d="M12 8c-.5 2-.5 6 0 9 .5-3 .5-7 0-9z"/>
  </svg>
);

export const JsIcon = () => (
  <svg viewBox="0 0 32 32" width="22" height="22">
    <rect width="32" height="32" rx="4" fill="#f7df1e"/>
    <text x="16" y="23" fill="#000000" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">JS</text>
  </svg>
);

export const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#38bdf8">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/>
  </svg>
);

export const TsIcon = () => (
  <svg viewBox="0 0 32 32" width="22" height="22">
    <rect width="32" height="32" rx="4" fill="#3178c6"/>
    <text x="16" y="22" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">TS</text>
  </svg>
);

export const HtmlIcon = () => (
  <svg viewBox="0 0 32 32" width="22" height="22">
    <path fill="#e34f26" d="M6 3l2.2 24.5L16 30l7.8-2.5L26 3H6z"/>
    <path fill="#ef652a" d="M16 5.2v22.4l5.9-1.9L23.7 5.2H16z"/>
    <text x="16" y="19" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">5</text>
  </svg>
);

export const CssIcon = () => (
  <svg viewBox="0 0 32 32" width="22" height="22">
    <path fill="#1572b6" d="M6 3l2.2 24.5L16 30l7.8-2.5L26 3H6z"/>
    <path fill="#33a9dc" d="M16 5.2v22.4l5.9-1.9L23.7 5.2H16z"/>
    <text x="16" y="19" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">3</text>
  </svg>
);

export const GithubIcon = ({ size = 20, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export const LinkedinIcon = ({ size = 20, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export const InstagramIcon = ({ size = 20, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const ExpressIcon = () => (
  <span style={{ fontWeight: '800', fontSize: '0.8rem', letterSpacing: '-0.03em', color: '#111827' }}>
    ex
  </span>
);

export const renderTechIcon = (name) => {
  const norm = (name || '').toLowerCase();
  if (norm.includes('react')) return <ReactIcon />;
  if (norm.includes('node')) return <NodeIcon />;
  if (norm.includes('mongo')) return <MongoIcon />;
  if (norm.includes('typescript') || norm === 'ts') return <TsIcon />;
  if (norm.includes('javascript') || norm === 'js') return <JsIcon />;
  if (norm.includes('tailwind')) return <TailwindIcon />;
  if (norm.includes('html')) return <HtmlIcon />;
  if (norm.includes('css')) return <CssIcon />;
  if (norm.includes('git')) return <GithubIcon size={20} color="#111827" />;
  if (norm.includes('express')) return <ExpressIcon />;
  if (norm.includes('algo') || norm.includes('logic')) return <Code size={20} color="#111827" />;
  if (norm.includes('api') || norm.includes('server')) return <Server size={20} color="#111827" />;
  if (norm.includes('db') || norm.includes('sql')) return <Database size={20} color="#111827" />;

  return <Box size={20} color="#111827" />;
};
