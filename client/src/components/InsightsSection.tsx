import { Button } from "@/components/ui/button";
import { GitGraph, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const InsightsSection = () => {
  const insights = [
    {
      title: "AI in Supply Chain",
      description: "Discover how agentic AI is reshaping logistics and streamlining operations.",
      icon: <GitGraph className="h-6 w-6 text-cyan" />
    },
    {
      title: "AI as Team Members",
      description: "See how teams leverage AI agents to enhance decision-making and productivity.",
      icon: <Users className="h-6 w-6 text-cyan" />
    },
    {
      title: "Workflow Case Study",
      description: "Learn how we helped a Fortune 500 firm gain 40% efficiency with smart automation.",
      icon: <CheckCircle className="h-6 w-6 text-cyan" />
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
        
        <div className="grid md:grid-cols-3 gap-8">
          {insights.map((insight, index) => (
            <Card 
              key={index} 
              className="bg-white dark:bg-navy-light border-none rounded-lg shadow-md overflow-hidden
                       transition-transform hover:scale-105 duration-300 flex flex-col"
            >
              <div className="h-48 bg-gray-200 dark:bg-navy-dark"></div>
              <CardContent className="p-6 flex-grow">
                <div className="flex justify-center mb-4">
                  <div className="p-2 rounded-full bg-cyan bg-opacity-20">
                    {insight.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-navy dark:text-soft-white">
                  {insight.title}
                </h3>
                <p className="text-neutral-gray dark:text-gray-300 text-center">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            className="inline-block bg-navy dark:bg-cyan hover:bg-navy-light dark:hover:bg-cyan-light 
                     text-soft-white dark:text-navy font-medium py-2 px-6 rounded-md transition-colors duration-300"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
