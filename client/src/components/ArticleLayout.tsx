import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface ArticleLayoutProps {
  children: React.ReactNode;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-soft-white dark:bg-navy text-navy dark:text-soft-white transition-colors duration-300">
      <Header />
      <main className="pt-16 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ArticleLayout;