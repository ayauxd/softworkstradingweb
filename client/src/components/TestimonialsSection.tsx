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
      name: "Alex C.",
      role: "CTO, Software Development Industry",
      quote: "Their intelligent workflow automation transformed our development pipeline, removing bottlenecks we thought were permanent."
    },
    {
      name: "Sarah J.",
      role: "Operations Director, E-commerce Industry",
      quote: "The AI-powered inventory management system saved our team 20+ hours per week. Their expertise was invaluable in identifying where automation could best serve our business needs."
    },
    {
      name: "Michael R.",
      role: "Founder, Tech Startup",
      quote: "As a non-technical founder, I was hesitant about AI integration. The process was painless and delivered results that immediately improved our customer response times by 70%."
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
              <CarouselItem key={index} className="px-1 sm:px-4">
                <Card className="bg-navy-light rounded-lg p-4 sm:p-8 shadow-lg border-none">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center">
                      <div className="text-center">
                        <svg className="h-10 w-10 sm:h-12 sm:w-12 text-cyan mb-4 opacity-50 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-base sm:text-lg mb-4 text-white">{testimonial.quote}</p>
                        <div className="pt-2 border-t border-navy-dark">
                          <h4 className="font-bold text-lg text-white mt-2">{testimonial.name}</h4>
                          <p className="text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Hide carousel arrows on mobile but show on larger screens */}
          <div className="hidden sm:block">
            <CarouselPrevious className="absolute -left-4 sm:-left-10 top-1/2 -translate-y-1/2 bg-cyan text-navy hover:bg-cyan-light" />
            <CarouselNext className="absolute -right-4 sm:-right-10 top-1/2 -translate-y-1/2 bg-cyan text-navy hover:bg-cyan-light" />
          </div>
          
          {/* More prominent dots on mobile */}
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`w-4 h-4 p-0 rounded-full border ${
                  index === current 
                    ? 'bg-cyan border-cyan' 
                    : 'bg-gray-500 bg-opacity-30 border-gray-400'
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
