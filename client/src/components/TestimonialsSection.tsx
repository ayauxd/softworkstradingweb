import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-navy dark:bg-navy-dark text-soft-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
        </div>
        
        <Card className="max-w-4xl mx-auto bg-navy-light rounded-lg p-8 shadow-lg border-none">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0 flex justify-center">
                <Avatar className="w-20 h-20 border-2 border-cyan">
                  <AvatarFallback className="text-cyan bg-navy">AC</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <svg className="h-12 w-12 text-cyan mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg mb-4 text-white">
                  Softworks has completely transformed our operational workflows. 
                  Their intelligent systems removed bottlenecks we thought were permanent.
                </p>
                <div>
                  <h4 className="font-bold text-lg text-white">Alex Chen</h4>
                  <p className="text-gray-400">CTO, TechSolutions Inc.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TestimonialsSection;
