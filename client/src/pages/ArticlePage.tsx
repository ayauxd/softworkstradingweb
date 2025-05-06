import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useParams, Link } from 'wouter';

// Import articles from shared data file
import { articles } from '../data/articles';

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = parseInt(id || '1');
  const article = articles.find(a => a.id === articleId) || articles[0];

  // Scroll to top when navigating to an article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  return (
    <div className="bg-soft-white dark:bg-navy min-h-screen">
      <main id="main-content">
      {/* Hero Section with Article Image */}
      <div className="w-full h-96 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${article.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-10 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 text-cyan mb-4">
              <Link href="/" className="text-cyan hover:text-cyan-light transition flex items-center">
                <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/blog" className="text-cyan hover:text-cyan-light transition">
                Insights
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center text-gray-300 gap-4 md:gap-6">
              <div className="flex items-center">
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center">
                <span>{article.date}</span>
              </div>
              <div className="flex items-center">
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-navy-light shadow-lg rounded-lg p-8 mb-8">
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto bg-navy dark:bg-navy-dark text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to transform your workflows?</h3>
          <p className="mb-6">
            Let our experts show you how AI can help your business achieve similar results.
          </p>
          <Link href="/#contact">
            <Button className="bg-cyan hover:bg-cyan-light text-navy font-semibold py-3 px-8 rounded-md transition-all duration-300">
              Schedule a Consultation
            </Button>
          </Link>
        </div>

        {/* More Articles */}
        <div className="max-w-3xl mx-auto mt-12">
          <h3 className="text-2xl font-bold mb-6 text-navy dark:text-soft-white">More Insights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {articles
              .filter(a => a.id !== articleId)
              .slice(0, 2)
              .map(relatedArticle => (
                <Link
                  key={relatedArticle.id}
                  href={`/article/${relatedArticle.id}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-navy-light rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-105 duration-300">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${relatedArticle.imageUrl})` }}
                    ></div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-navy dark:text-soft-white mb-2">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {relatedArticle.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
