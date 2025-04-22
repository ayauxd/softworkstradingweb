import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useEffect, useState, useCallback } from "react";

const TestimonialsSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const testimonials = [
    {
      name: "Alex Chen",
      role: "CTO, TechSolutions Inc.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGUlMjBmYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=60",
      quote: "Softworks has completely transformed our operational workflows. Their intelligent systems removed bottlenecks we thought were permanent."
    },
    {
      name: "Sarah Johnson",
      role: "Operations Director, Quantum Retail",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=60",
      quote: "The workflow automation solutions Softworks implemented saved our team 20+ hours per week. Their expertise was invaluable in identifying where AI could best serve our business needs."
    },
    {
      name: "Michael Rodriguez",
      role: "Founder, InnovateMind",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHByb2ZpbGUlMjBmYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=60",
      quote: "As a non-technical founder, I was hesitant about AI integration. Softworks made the process painless and delivered results that immediately improved our customer response times by 70%."
    }
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!api) return;
    
    const autoplay = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(autoplay);
  }, [api]);

  // Function to scroll to specific slide
  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <section id="testimonials" className="py-20 bg-navy dark:bg-navy-dark text-soft-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
        </div>
        
        <Carousel 
          className="max-w-4xl mx-auto"
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card className="bg-navy-light rounded-lg p-8 shadow-lg border-none">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center">
                      <div>
                        <svg className="h-12 w-12 text-cyan mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-lg mb-4 text-white">{testimonial.quote}</p>
                        <div className="text-center">
                          <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                          <p className="text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="absolute -left-10 top-1/2 -translate-y-1/2 bg-cyan text-navy hover:bg-cyan-light" />
          <CarouselNext className="absolute -right-10 top-1/2 -translate-y-1/2 bg-cyan text-navy hover:bg-cyan-light" />
          
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`w-3 h-3 p-0 rounded-full ${index === current ? 'bg-cyan' : 'bg-gray-500 bg-opacity-50'}`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
