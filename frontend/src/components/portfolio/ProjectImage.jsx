import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
export default function ProjectImage({ src, alt, className = '', ...props }) {
  const [failedSource, setFailedSource] = useState(null);
  if (!src || failedSource === src) return <div className={`project-image-unavailable ${className}`} role="img" aria-label={`${alt}: image unavailable`}><ImageIcon size={32} strokeWidth={1}/><span>{alt}</span><small>Preview unavailable</small></div>;
  return <img {...props} src={src} alt={alt} className={className} onError={() => setFailedSource(src)}/>;
}
