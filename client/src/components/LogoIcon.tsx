import logoImage from '../assets/logo.png';
import { useTheme } from '../hooks/use-theme-toggle';

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
      <img
        src={logoImage}
        alt="Softworks Trading Company"
        className={`w-full h-full object-contain ${shouldUseWhiteLogo ? 'brightness-0 invert' : ''}`}
        width="auto"
        height="100%"
      />
    </div>
  );
};

export default LogoIcon;
