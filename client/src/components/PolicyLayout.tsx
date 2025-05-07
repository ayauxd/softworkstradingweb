import React from 'react';
import Header from './Header';
import Footer from './Footer';
import LogoIcon from './LogoIcon';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@/hooks/use-theme-toggle';

interface PolicyLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ children, title, description }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-soft-white dark:bg-navy-dark text-navy dark:text-soft-white transition-colors duration-300">
      <Helmet>
        <title>{title} | Softworks Trading Company</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.softworkstrading.com${window.location.pathname}`} />
      </Helmet>
      
      <Header />
      
      <main id="main-content" className="pt-16 flex-grow" role="main">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto bg-white dark:bg-navy rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 lg:p-10">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PolicyLayout;