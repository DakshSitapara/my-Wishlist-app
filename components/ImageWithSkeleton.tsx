'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ src, alt }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-48 rounded-md overflow-hidden bg-gray-200 mb-4">
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gray-300" />
      )}
      <Image
        src={!error ? src.trimStart() : '/fallback.jpg'}
        alt={alt}
        width={500}
        height={300}
        className={`w-full h-48 object-cover rounded-md transition-opacity duration-500  ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithSkeleton;
