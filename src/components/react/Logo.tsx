import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 48 }) => {
  return (
    <div className={`inline-flex items-center gap-0 ${className}`}>
      <img 
        src="/logo.svg" 
        alt="Orderpilot Logo" 
        style={{ height: size, width: 'auto' }}
        className="shrink-0 translate-y-[1px]"
        referrerPolicy="no-referrer"
      />
      <span className="text-2xl font-extrabold tracking-tight">Orderpilot</span>
    </div>
  );
};

export default Logo;
