import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';

// Import articles from shared data file
import { articles } from '../data/articles';

export default function ArticlePage() {
  const params = useParams();
  const { id, slug } = params;
  const articleId = parseInt(id || '1');
  const article = articles.find(a => a.id === articleId) || articles[0];
  
  // If the article is loaded but the slug in the URL doesn't match the article's slug,
  // redirect to the correct URL format without reloading the page
  useEffect(() => {
    if (article && slug !== article.slug && typeof window !== 'undefined') {
      window.history.replaceState(
        null, 
        '', 
        `/article/${article.id}/${article.slug}`
      );
    }
  }, [article, slug]);

  // Scroll to top when navigating to an article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  // Base URL for absolute URLs
  const baseUrl = "https://www.softworkstrading.com";
  
  // Extract the first paragraph for description
  const getDescription = (content: string) => {
    const firstParagraphMatch = content.match(/<p>(.*?)<\/p>/);
    return firstParagraphMatch 
      ? firstParagraphMatch[1].replace(/<[^>]*>/g, '').substring(0, 160) 
      : article.description;
  };

  return (
    <div className="bg-soft-white dark:bg-navy min-h-screen">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.title} | Softworks Trading Company</title>
        <meta name="description" content={getDescription(article.content)} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${baseUrl}/article/${article.id}/${article.slug}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={getDescription(article.content)} />
        <meta property="og:image" content={`${baseUrl}${article.imageUrl}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={article.title} />
        <meta property="og:site_name" content="Softworks Trading Company" />
        <meta property="article:published_time" content={new Date(article.date).toISOString()} />
        <meta property="article:author" content={article.author} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${baseUrl}/article/${article.id}/${article.slug}`} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={getDescription(article.content)} />
        <meta name="twitter:image" content={`${baseUrl}${article.imageUrl}`} />
        <meta name="twitter:image:alt" content={article.title} />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={article.author} />
        <meta name="twitter:label2" content="Read Time" />
        <meta name="twitter:data2" content={article.readTime} />
        
        {/* Additional Meta */}
        <link rel="canonical" href={`${baseUrl}/article/${article.id}/${article.slug}`} />
        
        {/* Structured Data (JSON-LD) for Articles */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": getDescription(article.content),
            "image": [`${baseUrl}${article.imageUrl}`],
            "datePublished": new Date(article.date).toISOString(),
            "dateModified": new Date(article.date).toISOString(),
            "author": {
              "@type": "Person",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Softworks Trading Company",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/assets/images/logo/logo.png`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${baseUrl}/article/${article.id}/${article.slug}`
            }
          })}
        </script>
      </Helmet>
      
      <main id="main-content">
      {/* Hero Section - Text Only */}
      <div className="w-full py-16 bg-navy dark:bg-navy-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
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
          {/* Featured Article Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-auto object-contain"
            />
          </div>
          
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Call to Action with ID for direct linking */}
        <div id="transform-operations" className="max-w-3xl mx-auto bg-navy dark:bg-navy-dark text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Operations?</h3>
          <p className="mb-6">
            Let's explore how intelligent systems can streamline your business with practical automation solutions.
          </p>
          <form id="consultation-form" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                <input type="text" id="name" name="name" className="w-full px-4 py-2 bg-navy-light border border-gray-600 rounded-md text-white" placeholder="Enter your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <input type="email" id="email" name="email" className="w-full px-4 py-2 bg-navy-light border border-gray-600 rounded-md text-white" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">How can we help?</label>
              <textarea id="message" name="message" rows={3} className="w-full px-4 py-2 bg-navy-light border border-gray-600 rounded-md text-white" placeholder="Tell us about your business needs"></textarea>
            </div>
            <Button type="submit" className="bg-cyan hover:bg-cyan-light text-navy font-semibold py-3 px-8 rounded-md transition-all duration-300" aria-label="Schedule a consultation about transforming your operations">
              Schedule a Consultation
            </Button>
          </form>
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
                  href={`/article/${relatedArticle.id}/${relatedArticle.slug}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-navy-light rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-105 duration-300">
                    <div
                      className="h-48 bg-contain bg-center bg-no-repeat"
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
