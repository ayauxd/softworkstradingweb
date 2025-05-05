import React from 'react';

interface ImageSources {
  avif?: Record<number, string>;
  webp?: Record<number, string>;
  jpg?: Record<number, string>;
  png?: Record<number, string>;
  fallback: string;
}

interface ResponsiveImageProps {
  sources: ImageSources;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

/**
 * ResponsiveImage component that renders optimized images with proper formats and sizes
 * 
 * @example
 * <ResponsiveImage
 *   sources={{
 *     avif: { 800: '/path/to/image-800.avif', 400: '/path/to/image-400.avif' },
 *     webp: { 800: '/path/to/image-800.webp', 400: '/path/to/image-400.webp' },
 *     jpg: { 800: '/path/to/image-800.jpg', 400: '/path/to/image-400.jpg' },
 *     fallback: '/path/to/image.jpg'
 *   }}
 *   alt="Description of image"
 *   className="w-full h-auto"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   loading="lazy"
 * />
 */
export function ResponsiveImage({
  sources,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  loading = 'lazy',
  priority = false,
}: ResponsiveImageProps) {
  // Convert formats to srcset strings
  const generateSrcSet = (format: Record<number, string> | undefined) => {
    if (!format) return '';
    return Object.entries(format)
      .map(([width, path]) => `${path} ${width}w`)
      .join(', ');
  };

  const avifSrcset = sources.avif ? generateSrcSet(sources.avif) : '';
  const webpSrcset = sources.webp ? generateSrcSet(sources.webp) : '';
  const jpgSrcset = sources.jpg ? generateSrcSet(sources.jpg) : '';
  const pngSrcset = sources.png ? generateSrcSet(sources.png) : '';

  return (
    <picture>
      {/* AVIF format - best compression, modern browsers */}
      {avifSrcset && (
        <source srcSet={avifSrcset} type="image/avif" sizes={sizes} />
      )}
      
      {/* WebP format - good compression, wide support */}
      {webpSrcset && (
        <source srcSet={webpSrcset} type="image/webp" sizes={sizes} />
      )}
      
      {/* JPG format - universal fallback */}
      {jpgSrcset && (
        <source srcSet={jpgSrcset} type="image/jpeg" sizes={sizes} />
      )}
      
      {/* PNG format - for transparency if needed */}
      {pngSrcset && (
        <source srcSet={pngSrcset} type="image/png" sizes={sizes} />
      )}
      
      {/* Fallback image */}
      <img
        src={sources.fallback}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}

export default ResponsiveImage;