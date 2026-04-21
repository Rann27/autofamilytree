import React from 'react';

interface OrnamentalDividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function OrnamentalDivider({ className = '', style }: OrnamentalDividerProps) {
  return (
    <div className={`divider-ornamental ${className}`} style={style}>✦</div>
  );
}
