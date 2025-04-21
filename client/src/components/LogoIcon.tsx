import logoImage from "../assets/logo.png";

interface LogoIconProps {
  className?: string;
}

const LogoIcon = ({ className = "" }: LogoIconProps) => {
  return (
    <img 
      src={logoImage} 
      alt="Softworks Logo" 
      className={className} 
    />
  );
};

export default LogoIcon;
