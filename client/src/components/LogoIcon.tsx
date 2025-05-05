import { useTheme } from '../hooks/use-theme-toggle';

// Optimized logo paths
const logoImages = {
  webp: '/optimized-images/logo/logo.webp',
  small: '/optimized-images/logo/logo-small.webp',
  fallback: '/assets/logo.png' // Use direct path instead of imported file
};

interface LogoIconProps {
  className?: string;
  isWhite?: boolean;
  showText?: boolean;
}

const LogoIcon = ({ className = '', isWhite = false, showText = false }: LogoIconProps) => {
  const { theme } = useTheme();
  // Use isWhite prop or automatically use white logo in dark mode
  const shouldUseWhiteLogo = isWhite || theme === 'dark';
  
  return (
    <div className={`${className} relative flex items-center`}>
      <picture className="max-w-[180px] md:max-w-[200px]">
        {/* WebP format with responsive sizes */}
        <source
          srcSet={`${logoImages.webp} 300w, ${logoImages.small} 150w`}
          sizes="(max-width: 768px) 150px, 200px"
          type="image/webp"
        />
        {/* Fallback to original PNG */}
        <img
          src={logoImages.fallback}
          alt="Softworks Trading Company"
          className={`w-auto h-auto max-h-full object-contain ${shouldUseWhiteLogo ? 'brightness-0 invert' : ''}`}
          width="200"
          height="62"
          loading="eager"
          style={{ aspectRatio: '3.23/1' }}
        />
      </picture>
    </div>
  );
};

export default LogoIcon;
