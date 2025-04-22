import logoImage from "../assets/logo.png";

interface LogoIconProps {
  className?: string;
  isWhite?: boolean;
}

const LogoIcon = ({ className = "", isWhite = false }: LogoIconProps) => {
  return (
    <div className={`${className} relative overflow-hidden rounded-full ${isWhite ? 'bg-white/10' : 'bg-transparent'} flex items-center justify-center`}>
      <img 
        src={logoImage} 
        alt="Softworks Logo" 
        className={`w-full h-full object-contain ${isWhite ? 'filter brightness-0 invert' : 'filter drop-shadow-md'}`}
      />
    </div>
  );
};

export default LogoIcon;
