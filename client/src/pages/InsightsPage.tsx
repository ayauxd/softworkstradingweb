import { Button } from '@/components/ui/button';
import { useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ArrowLeft, Search, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import the articles data from a shared location
import { articles } from '../data/articles';

export default function BlogPage() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Sort articles by date (newest first)
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, []);

  return (
    <div className="bg-soft-white dark:bg-navy min-h-screen flex flex-col">
      <Header />
      
      <main id="main-content">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-100 dark:bg-navy-dark border-b border-gray-200 dark:border-navy-light">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-cyan dark:text-gray-300 dark:hover:text-cyan-light">
                  <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                  </svg>
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Blog</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="w-full bg-navy dark:bg-navy-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            <p className="text-xl text-gray-300 mb-8">
              Explore our latest articles, case studies, and thoughts on AI automation, 
              productivity enhancement, and business transformation.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link href="/">
                <Button variant="outline" className="bg-transparent border-cyan text-cyan hover:bg-cyan hover:text-white dark:border-cyan-light dark:text-cyan-light dark:hover:bg-cyan-light dark:hover:text-navy transition-all duration-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter and Search Controls */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-navy dark:text-soft-white">All Articles</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <label htmlFor="article-search" className="sr-only">Search articles</label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              </div>
              <input 
                type="search" 
                id="article-search"
                className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-cyan focus:border-cyan dark:bg-navy-light dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                placeholder="Search articles..."
              />
            </div>
            <div className="relative">
              <button 
                id="filter-dropdown-button"
                aria-haspopup="listbox"
                aria-expanded="false"
                aria-controls="filter-dropdown-menu"
                className="flex items-center justify-between w-full p-2.5 text-sm text-left text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-cyan focus:border-cyan dark:bg-navy-light dark:border-gray-600 dark:text-white"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" aria-hidden="true" />
                  Filter by topic
                </span>
                <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
              {/* Hidden dropdown menu (would be shown with JavaScript in a real implementation) */}
              <div 
                id="filter-dropdown-menu" 
                role="listbox"
                tabIndex={-1}
                aria-labelledby="filter-dropdown-button"
                className="hidden absolute left-0 right-0 mt-1 z-10 bg-white dark:bg-navy-light shadow-lg rounded-md py-1"
              >
                {/* Dropdown options would go here */}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sortedArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/article/${article.id}`}
              className="block group focus:outline-none focus-visible:ring-0"
            >
              <div className="bg-white dark:bg-navy-light rounded-lg overflow-hidden shadow-md hover:shadow-lg focus-within:shadow-lg transition-all duration-300 h-full flex flex-col group-hover:translate-y-[-4px] group-focus-visible:translate-y-[-4px]">
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 group-focus-visible:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold text-navy dark:text-soft-white mb-2">
                    {article.title}
                  </h3>
                  <p className="text-navy-light dark:text-gray-300 mb-4 flex-grow">
                    {article.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          By {article.author}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {article.date} · {article.readTime}
                        </span>
                      </div>
                      <span className="text-cyan hover:text-cyan-dark dark:hover:text-cyan-light focus-visible:text-cyan-dark dark:focus-visible:text-cyan-light flex items-center transition-colors">
                        Read <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 group-focus-visible:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto mt-16 bg-navy dark:bg-navy-dark text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to transform your operations?</h3>
          <p className="mb-6">
            Let our experts show you how AI can help your business achieve measurable results with practical automation solutions.
          </p>
          <Link href="/#contact">
            <Button className="bg-cyan hover:bg-cyan-light text-navy font-semibold py-3 px-8 rounded-md transition-all duration-300">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
        
        {/* Related Resources */}
        <div className="max-w-5xl mx-auto mt-16 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-navy dark:text-soft-white">Related Content</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 dark:bg-navy-light dark:border-gray-700 dark:hover:bg-navy transition-all duration-300">
              <h5 className="mb-2 text-xl font-semibold tracking-tight text-navy dark:text-soft-white">AI Implementation Guide</h5>
              <p className="mb-3 text-gray-600 dark:text-gray-400">Download our comprehensive guide to implementing AI in your organization.</p>
              <span className="inline-flex items-center text-cyan hover:text-cyan-dark dark:hover:text-cyan-light">
                Download PDF
                <svg className="w-3 h-3 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                </svg>
              </span>
            </a>
            <a href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 dark:bg-navy-light dark:border-gray-700 dark:hover:bg-navy transition-all duration-300">
              <h5 className="mb-2 text-xl font-semibold tracking-tight text-navy dark:text-soft-white">Webinar: AI Strategy</h5>
              <p className="mb-3 text-gray-600 dark:text-gray-400">Watch our recorded webinar on developing an effective AI strategy for your business.</p>
              <span className="inline-flex items-center text-cyan hover:text-cyan-dark dark:hover:text-cyan-light">
                Watch Video
                <svg className="w-3 h-3 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                </svg>
              </span>
            </a>
            <a href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 dark:bg-navy-light dark:border-gray-700 dark:hover:bg-navy transition-all duration-300">
              <h5 className="mb-2 text-xl font-semibold tracking-tight text-navy dark:text-soft-white">Case Study Collection</h5>
              <p className="mb-3 text-gray-600 dark:text-gray-400">Explore our collection of detailed case studies showcasing successful AI implementations.</p>
              <span className="inline-flex items-center text-cyan hover:text-cyan-dark dark:hover:text-cyan-light">
                View Case Studies
                <svg className="w-3 h-3 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
      </main>
    </div>
  );
}
