interface LogoIconProps {
  className?: string;
  isWhite?: boolean;
  showText?: boolean;
}

const LogoIcon = ({ className = "", isWhite = false, showText = false }: LogoIconProps) => {
  const logoPath = "/assets/images/logo.png";

  return (
    <div className={`${className} relative flex items-center`}>
      <img 
        src={logoPath} 
        alt="Softworks Trading Company" 
        className={`w-full h-full object-contain ${isWhite ? 'brightness-0 invert' : ''}`}
      />
      {showText && (
        <span className="sr-only">Softworks Trading Company</span>
      )}
    </div>
  );
};

export default LogoIcon;
