interface LogoIconProps {
  className?: string;
}

const LogoIcon = ({ className = "" }: LogoIconProps) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none"
    >
      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="10" className="text-navy dark:text-navy-dark" />
      <g className="text-cyan">
        <circle cx="100" cy="40" r="15" fill="currentColor" />
        <circle cx="140" cy="65" r="15" fill="currentColor" />
        <circle cx="140" cy="135" r="15" fill="currentColor" />
        <circle cx="60" cy="135" r="15" fill="currentColor" />
        <circle cx="60" cy="65" r="15" fill="currentColor" />
        <path d="M100 40 L100 85" stroke="currentColor" strokeWidth="10" />
        <path d="M100 85 L140 65" stroke="currentColor" strokeWidth="10" />
        <path d="M100 85 L140 135" stroke="currentColor" strokeWidth="10" />
        <path d="M100 85 L60 135" stroke="currentColor" strokeWidth="10" />
        <path d="M100 85 L60 65" stroke="currentColor" strokeWidth="10" />
      </g>
    </svg>
  );
};

export default LogoIcon;
