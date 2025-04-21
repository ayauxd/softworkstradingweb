import React from 'react';
import ArticleLayout from '../../components/ArticleLayout';

export default function Article() {
  return (
    <ArticleLayout>
      <div className="max-w-3xl mx-auto py-16 px-6 text-[#0A2A43] dark:text-white">
        <h1 className="text-3xl font-bold mb-4">AI in Supply Chain</h1>
        <p className="text-lg leading-relaxed">
          This article content will be added manually. Placeholder content for now.
        </p>
      </div>
    </ArticleLayout>
  );
}