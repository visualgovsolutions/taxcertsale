import React, { useState, useEffect } from 'react';

// Simple Logo component that can be used across the application
// This uses a direct reference to the public folder for reliability
const Logo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  const [imageSrc, setImageSrc] = useState<string>('/VG.png');
  const [error, setError] = useState<boolean>(false);

  // List of possible image paths to try
  const possiblePaths = ['/VG.png', '/public/VG.png', '/assets/VG.png', '/images/VG.png', 'VG.png'];

  useEffect(() => {
    // Only try alternative paths if the current one failed
    if (error) {
      // Find the next path to try
      const currentIndex = possiblePaths.indexOf(imageSrc);
      const nextIndex = currentIndex < possiblePaths.length - 1 ? currentIndex + 1 : -1;

      if (nextIndex !== -1) {
        setImageSrc(possiblePaths[nextIndex]);
        setError(false);
      }
    }
  }, [error, imageSrc]);

  return (
    <img
      src={imageSrc}
      alt="VisualGov Solutions Logo"
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default Logo;
