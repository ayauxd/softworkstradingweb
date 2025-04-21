import { Button } from "@/components/ui/button";
import { GitGraph, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const InsightsSection = () => {
  const insights = [
    {
      title: "AI in Supply Chain",
      description: "Discover how agentic AI is reshaping logistics and streamlining operations.",
      imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHN1cHBseSUyMGNoYWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    },
    {
      title: "AI as Team Members",
      description: "See how teams leverage AI agents to enhance decision-making and productivity.",
      imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWklMjBjb2xsYWJvcmF0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    },
    {
      title: "Workflow Case Study",
      description: "Learn how we helped a Fortune 500 firm gain 40% efficiency with smart automation.",
      imageUrl: "https://images.unsplash.com/photo-1453906971074-ce568cccbc63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhc2UlMjBzdHVkeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    }
  ];
  
  return (
    <section id="insights" className="py-20 bg-soft-white dark:bg-navy transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy dark:text-soft-white">
            Insights & Publications
          </h2>
          <p className="text-lg text-neutral-gray dark:text-gray-300 max-w-3xl mx-auto">
            Explore how businesses like yours are using AI to scale faster.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {insights.slice(0, 2).map((insight, index) => (
            <a 
              key={index} 
              href={`/article/${index + 1}`}
              className="block p-4"
            >
              <Card 
                className="bg-white dark:bg-navy-light border-none rounded-lg shadow-md overflow-hidden
                         transition-transform hover:scale-105 duration-300 flex flex-col h-full"
              >
                <div className="h-64 bg-gray-200 dark:bg-navy-dark overflow-hidden">
                  <img 
                    src={insight.imageUrl} 
                    alt={insight.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 flex-grow">
                  <h3 className="text-2xl font-semibold mb-4 text-navy dark:text-soft-white">
                    {insight.title}
                  </h3>
                  <p className="text-lg text-neutral-gray dark:text-gray-300">
                    {insight.description}
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
                     text-soft-white dark:text-navy font-medium py-2 px-6 rounded-md transition-colors duration-300"
          >
            <a href="/articles">View All Articles</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
