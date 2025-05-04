import { Button } from "@/components/ui/button";
import { GitGraph, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const InsightsSection = () => {
  const insights = [
    {
      title: "AI in Supply Chain",
      description: "Discover how agentic AI is reshaping logistics and streamlining operations.",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80"
    },
    {
      title: "AI as Team Members",
      description: "See how teams leverage AI agents to enhance decision-making and productivity.",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80"
    },
    {
      title: "AI Prompting Best Practices",
      description: "Learn essential techniques for crafting effective prompts to get the best results from AI language models.",
      imageUrl: "https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80"
    }
  ];
  
  return (
    <section id="insights" className="py-20 bg-soft-white dark:bg-navy transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy dark:text-soft-white">
            Publications
          </h2>
          <p className="text-lg text-neutral-gray dark:text-gray-300 max-w-3xl mx-auto">
            Explore our latest articles and research on AI and automation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {insights.map((insight, index) => (
            <a 
              key={index} 
              href={`/article/${index + 1}`}
              className="block p-4"
            >
              <Card 
                className="bg-white dark:bg-navy-light border-none rounded-lg shadow-md overflow-hidden
                         transition-transform hover:scale-105 duration-300 flex flex-col h-full"
              >
                <div className="h-52 bg-gray-200 dark:bg-navy-dark overflow-hidden">
                  <img 
                    src={insight.imageUrl} 
                    alt={insight.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-3 text-navy dark:text-soft-white">
                    {insight.title}
                  </h3>
                  <p className="text-base text-neutral-gray dark:text-gray-300 mb-3">
                    {insight.description}
                  </p>
                  <p className="text-cyan hover:text-cyan-light dark:text-cyan-light dark:hover:text-cyan transition-colors font-medium text-sm flex items-center">
                    Continue article... <span className="sr-only">about {insight.title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            asChild
            className="inline-block bg-navy dark:bg-cyan hover:bg-navy-light dark:hover:bg-cyan-light 
                     text-soft-white dark:text-navy font-medium py-2 px-6 rounded-md transition-colors duration-300
                     focus:ring-2 focus:ring-navy-light dark:focus:ring-cyan-light focus:ring-offset-2 
                     focus:ring-offset-soft-white dark:focus:ring-offset-navy active:translate-y-0.5 shadow-md"
          >
            <a href="/articles" aria-label="Browse all published articles and insights">
              View All Articles
              <span className="sr-only"> - Browse our complete publication archive</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
