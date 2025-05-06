import { Button } from "@/components/ui/button";
import { GitGraph, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import React from "react";
import { Link } from "wouter";

// Import articles from shared data file
import { articles as allArticles } from "../data/articles";

const InsightsSection = () => {
  // Map icons to articles based on their id
  const getIconForArticle = (id: number) => {
    switch (id % 3) {
      case 0: return GitGraph;
      case 1: return Users;
      case 2: return CheckCircle;
      default: return Users;
    }
  };
  
  // Sort articles by date (newest first) and take the 3 most recent
  const displayedArticles = useMemo(() => {
    return [...allArticles]
      .sort((a, b) => {
        // Parse dates and sort in descending order (newest first)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3); // Take only the 3 most recent articles
  }, []);
  
  return (
    <section id="insights" className="py-20 bg-soft-white dark:bg-navy transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy dark:text-soft-white">
            Industry Insights
          </h2>
          <p className="text-lg text-neutral-gray dark:text-gray-300 max-w-3xl mx-auto">
            Explore our latest research and industry perspectives on AI automation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayedArticles.map((article: typeof allArticles[0]) => (
            <Link 
              key={article.id} 
              href={`/article/${article.id}/${article.slug}`}
              className="block group"
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-navy-light dark:border-navy-light">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-navy">
                    <picture>
                      <source srcSet={article.imageUrl} type="image/webp" />
                      <img 
                        src={article.fallbackImageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        width="600"
                        height="338"
                      />
                    </picture>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-navy dark:text-soft-white mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-neutral-gray dark:text-gray-300 mb-3">
                    {article.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden">
                      By {article.author}
                    </p>
                    <p className="text-cyan hover:text-cyan-light dark:text-cyan-light dark:hover:text-cyan transition-colors font-medium text-sm flex items-center">
                      Continue article... <span className="sr-only">about {article.title}</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/blog">
            <Button variant="outline" className="bg-transparent border-cyan text-cyan hover:bg-cyan hover:text-white dark:border-cyan-light dark:text-cyan-light dark:hover:bg-cyan-light dark:hover:text-navy transition-all duration-300 px-6 py-2 rounded-md">
              View All Insights
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
