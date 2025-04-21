import logoImage from "../assets/logo.png";

interface LogoIconProps {
  className?: string;
}

const LogoIcon = ({ className = "" }: LogoIconProps) => {
  return (
    <div className={`${className} relative overflow-hidden rounded-full bg-transparent flex items-center justify-center`}>
      <img 
        src={logoImage} 
        alt="Softworks Logo" 
        className="w-full h-full object-contain filter drop-shadow-md" 
      />
    </div>
  );
};

export default LogoIcon;
