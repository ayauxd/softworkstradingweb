import logoImage from "../assets/logo.png";

interface LogoIconProps {
  className?: string;
  isWhite?: boolean;
  showText?: boolean;
}

const LogoIcon = ({ className = "", isWhite = false, showText = false }: LogoIconProps) => {
  return (
    <div className={`${className} relative flex items-center`}>
      <img 
        src={logoImage} 
        alt="Softworks Trading Company" 
        className={`w-full h-full object-contain ${isWhite ? 'brightness-0 invert' : ''}`}
      />
    </div>
  );
};

export default LogoIcon;
