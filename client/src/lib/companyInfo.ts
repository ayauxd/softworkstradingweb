/**
 * Company information for AI system prompt
 * This mirrors the server-side knowledge base but is available client-side
 * for direct API calls when fallback is needed
 */

export const companyInfo = {
  company: {
    name: "Softworks Trading Company",
    description: "Softworks Trading Company helps non-technical teams implement high-impact AI solutions that deliver measurable results within weeks, not months. Our approach eliminates the need for technical expertise in prompt engineering, APIs, or automation tools.",
    tagline: "Automate Your Business With Practical AI Solutions",
    value_proposition: "Streamline your operations with AI workflows that deliver measurable results.",
    mission: "To democratize AI technology by making powerful automation accessible to non-technical teams across all industries.",
    vision: "A world where every business can leverage AI to eliminate repetitive work and focus on human creativity and innovation.",
    contact: {
      email: "agent@softworkstrading.com",
      support_email: "support@softworkstrading.com",
      website: "https://softworkstrading.com"
    }
  },
  
  services: [
    {
      name: "AI Strategy Consultation",
      tagline: "Expert guidance without technical expertise",
      description: "Get expert guidance on integrating AI into your business strategy without needing technical expertise.",
      benefits: [
        "Identify high-impact automation opportunities unique to your business",
        "Receive expert guidance without needing technical knowledge",
        "Gain clarity on expected ROI and implementation timelines"
      ],
      details: [
        "Comprehensive review of your current workflows",
        "AI roadmap with concrete implementation steps",
        "Projected cost savings and productivity gains",
        "Technology stack recommendations"
      ]
    },
    {
      name: "Founders' Workflow Coaching",
      tagline: "Optimize personal and team productivity",
      description: "Optimize your personal and team workflows for maximum productivity and focus.",
      benefits: [
        "Reclaim hours of your time each week through targeted automation",
        "Eliminate decision fatigue with streamlined processes",
        "Create reliable systems for knowledge capture and transfer"
      ],
      details: [
        "Time audit to identify where your valuable time is being spent",
        "Task automation to handle repetitive work",
        "Decision frameworks to streamline your decision-making process",
        "Knowledge management systems to capture and leverage company knowledge"
      ]
    },
    {
      name: "Rapid Automation Deployment",
      tagline: "Efficient, tailored automation solutions",
      description: "Implement efficient automation solutions tailored to your business needs.",
      benefits: [
        "Eliminate repetitive, time-consuming tasks",
        "Reduce human error in routine processes",
        "Free up your team to focus on creative and strategic work"
      ],
      details: [
        "Process analysis to identify high-impact automation opportunities",
        "Custom solutions tailor-made for your specific needs",
        "Integration with your existing tools and software",
        "Continuous improvement of your automated processes"
      ]
    },
    {
      name: "Process Optimization",
      tagline: "Streamline business operations",
      description: "Analyze and optimize your business processes for maximum efficiency.",
      benefits: [
        "Eliminate redundancies and process inefficiencies",
        "Reduce operational costs through streamlined workflows",
        "Improve service delivery speed and consistency"
      ],
      details: [
        "Comprehensive process mapping and analysis",
        "Bottleneck identification and elimination",
        "Workflow redesign for optimal performance",
        "Implementation support and staff training"
      ]
    },
    {
      name: "AI Implementation",
      tagline: "Technical deployment without the complexity",
      description: "Execute AI solutions that connect to your existing tools and systems.",
      benefits: [
        "Implement advanced AI capabilities without technical expertise",
        "Seamlessly integrate with your existing software ecosystem",
        "Avoid common implementation pitfalls and security risks"
      ],
      details: [
        "Seamless integration with your current software stack",
        "No-code automation setup and configuration",
        "Custom AI agent development for specific workflows",
        "Ongoing maintenance and optimization"
      ]
    }
  ],
  
  process: [
    { 
      step: 1, 
      name: "Tell Us Your Needs", 
      description: "Discuss your routine tasks and identify areas ready for AI automation.",
      detailed_description: "We begin with a comprehensive discovery session to understand your business, challenges, and goals. Our team conducts interviews with key stakeholders to identify routine tasks that consume significant time and are good candidates for automation."
    },
    { 
      step: 2, 
      name: "Get a Custom Plan", 
      description: "Receive a simple, actionable AI workflow designed specifically for your tasks.",
      detailed_description: "Based on the needs assessment, our team develops a custom automation plan tailored to your specific requirements. We design AI workflows that integrate with your existing systems and align with your team's capabilities."
    },
    { 
      step: 3, 
      name: "Implement and Improve", 
      description: "Quickly start using your new automation and easily refine it for better results.",
      detailed_description: "We handle the technical implementation of your AI solution, ensuring seamless integration with existing systems. Our iterative approach allows for rapid deployment of initial functionality followed by continuous refinement."
    }
  ],
  
  faqs: [
    { 
      question: "What does Softworks Trading Company do?",
      answer: "Softworks Trading Company helps non-technical teams implement high-impact AI solutions that deliver measurable results within weeks, not months. We specialize in workflow automation, AI strategy consultation, and rapid automation deployment without requiring you to have technical expertise in prompt engineering, APIs, or automation tools."
    },
    {
      question: "How is Softworks different from other AI consultancies?",
      answer: "Unlike many AI consultancies that focus on complex technical implementations, we specialize in practical, results-driven solutions for non-technical teams. Our approach eliminates the need for you to understand prompt engineering, APIs, or automation tools. We focus on delivering measurable ROI within weeks rather than months."
    },
    { 
      question: "Do I need technical knowledge to work with Softworks?",
      answer: "No. Our approach is specifically designed for non-technical teams and businesses. We handle all the technical aspects of AI implementation, allowing you to focus on the business outcomes and benefits without needing to understand the underlying technology."
    },
    {
      question: "How quickly can I expect to see results?",
      answer: "Most clients see initial results within weeks, not months. Our rapid automation deployment service is designed to identify high-impact opportunities and implement solutions quickly, allowing you to realize benefits almost immediately."
    }
  ],
  
  industries: [
    {
      name: "Professional Services",
      challenges: [
        "Time-consuming client reporting and documentation",
        "Inefficient knowledge management and sharing",
        "Administrative overhead reducing billable hours"
      ],
      solutions: [
        "Automated report generation and client communications",
        "AI-powered knowledge bases and document creation",
        "Administrative task automation for billing and scheduling"
      ]
    },
    {
      name: "E-commerce",
      challenges: [
        "Managing customer service across multiple channels",
        "Inventory management and demand forecasting",
        "Personalization at scale"
      ],
      solutions: [
        "Omnichannel customer service automation",
        "AI-powered inventory and supply chain management",
        "Personalized marketing and product recommendations"
      ]
    },
    {
      name: "Healthcare",
      challenges: [
        "Administrative burden on clinical staff",
        "Patient scheduling and follow-up management",
        "Documentation and compliance requirements"
      ],
      solutions: [
        "Clinical documentation automation and summarization",
        "Intelligent patient scheduling and reminder systems",
        "Compliance monitoring and reporting automation"
      ]
    }
  ],
  
  case_studies: [
    {
      title: "Reducing Customer Service Response Time by 70%",
      industry: "E-commerce",
      challenge: "A medium-sized e-commerce company was struggling with customer service response times, leading to customer dissatisfaction and lost sales.",
      solution: "We implemented an AI-powered customer service automation system that could handle 80% of routine inquiries instantly.",
      results: [
        "Reduced average response time from 8 hours to under 30 minutes",
        "Improved customer satisfaction scores by 35%",
        "Enabled 24/7 customer support coverage without additional staffing"
      ]
    },
    {
      title: "Automating Financial Reporting for a Growing Accounting Firm",
      industry: "Professional Services",
      challenge: "A regional accounting firm was spending 15-20 hours per week manually generating client financial reports.",
      solution: "We developed an automated financial reporting system that extracts data from their accounting software and generates customized reports with insights.",
      results: [
        "Reduced report generation time from 15-20 hours to less than 2 hours per week",
        "Enabled the firm to take on 40% more clients without hiring additional staff",
        "Improved report accuracy by eliminating manual data entry errors"
      ]
    }
  ],
  
  testimonials: [
    {
      name: "Alex C.",
      role: "CTO, Software Development Industry",
      company: "DevCore Solutions",
      quote: "Their intelligent workflow automation transformed our development pipeline, removing bottlenecks we thought were permanent."
    },
    {
      name: "Sarah J.",
      role: "Operations Director, E-commerce Industry",
      company: "Boutique Collective",
      quote: "The AI-powered inventory management system saved our team 20+ hours per week. Their expertise was invaluable in identifying where automation could best serve our business needs."
    },
    {
      name: "Michael R.",
      role: "Founder, Tech Startup",
      company: "InnovatePro",
      quote: "As a non-technical founder, I was hesitant about AI integration. The process was painless and delivered results that immediately improved our customer response times by 70%."
    }
  ]
};

/**
 * Generate a system prompt for AI chat
 * This replicates the server-side functionality for direct API calls
 */
export function generateSystemPrompt(mode: 'standard' | 'detailed' | 'concise' = 'standard'): string {
  const company = companyInfo.company;
  
  // Format services information
  const servicesText = companyInfo.services.map(service => {
    if (mode === 'concise') {
      return `${service.name}: ${service.description}`;
    } else if (mode === 'detailed') {
      return `${service.name}: ${service.description}\n` +
        `Benefits: ${service.benefits.join(', ')}\n` +
        `Details: ${service.details.join(', ')}`;
    } else {
      return `${service.name}: ${service.description}\n` +
        `Key features: ${service.details.join(', ')}`;
    }
  }).join('\n\n');
  
  // Format process steps
  const processText = companyInfo.process.map(step => 
    `${step.step}. ${step.name}: ${step.description}`
  ).join('\n');
  
  // Format FAQs based on mode
  let faqsText;
  if (mode === 'concise') {
    // Include only two most important FAQs in concise mode
    faqsText = companyInfo.faqs.slice(0, 2).map(faq => 
      `Q: ${faq.question}\nA: ${faq.answer}`
    ).join('\n\n');
  } else if (mode === 'detailed') {
    // Include all FAQs in detailed mode
    faqsText = companyInfo.faqs.map(faq => 
      `Q: ${faq.question}\nA: ${faq.answer}`
    ).join('\n\n');
  } else {
    // Standard mode - include 3 FAQs
    faqsText = companyInfo.faqs.slice(0, 3).map(faq => 
      `Q: ${faq.question}\nA: ${faq.answer}`
    ).join('\n\n');
  }
  
  // Format industries if not in concise mode
  const industriesText = mode === 'concise' ? '' : 
    companyInfo.industries.map(industry => 
      `${industry.name}: Challenges: ${industry.challenges.join(', ')}\n` +
      `Solutions: ${industry.solutions.join(', ')}`
    ).join('\n\n');
  
  // Compile the full system prompt
  let prompt = `You are a workflow automation agent for ${company.name}. Your role is to help businesses implement AI solutions to optimize their operations.\n\n`;
  
  prompt += `COMPANY INFORMATION:\n`;
  prompt += `${company.name} - ${company.description}\n`;
  prompt += `Tagline: "${company.tagline}"\n`;
  prompt += `Value Proposition: ${company.value_proposition}\n`;
  
  if (mode === 'detailed') {
    prompt += `Mission: ${company.mission}\n`;
    prompt += `Vision: ${company.vision}\n`;
  }
  
  prompt += `Contact Email: ${company.contact.email}\n`;
  prompt += `Website: ${company.contact.website}\n\n`;
  
  prompt += `OUR SERVICES:\n${servicesText}\n\n`;
  
  prompt += `OUR PROCESS:\n${processText}\n\n`;
  
  if (mode !== 'concise' && industriesText) {
    prompt += `INDUSTRIES WE SERVE:\n${industriesText}\n\n`;
  }
  
  prompt += `FREQUENTLY ASKED QUESTIONS:\n${faqsText}\n\n`;
  
  prompt += `GUIDELINES FOR RESPONSES:\n`;
  prompt += `- Be proactive and guide the conversation with specific questions about their business needs\n`;
  prompt += `- Maintain a helpful, friendly, and professional tone\n`;
  prompt += `- When users are new, explain our services and guide them through our capabilities\n`;
  prompt += `- If a user seems confused, offer clear examples of how we can help them\n`;
  prompt += `- Always provide specific, actionable information rather than generic statements\n`;
  prompt += `- When asked for contact information, provide '${company.contact.email}' consistently\n`;
  prompt += `- Offer concrete examples of AI implementation when appropriate\n`;
  prompt += `- Remember client details and reference them in subsequent interactions\n`;
  prompt += `- Focus on helping non-technical teams implement practical AI solutions\n`;
  prompt += `- Emphasize our ability to deliver results within weeks, not months\n`;
  prompt += `- Highlight that our approach eliminates the need for technical expertise\n`;
  
  return prompt;
}

/**
 * Generate a voice-optimized system prompt
 */
export function generateVoiceSystemPrompt(): string {
  return generateSystemPrompt('concise') + `\n
ADDITIONAL VOICE GUIDELINES:
- Keep responses concise and easy to follow in a spoken format
- Use simple, clear language without technical jargon
- Break information into digestible chunks
- Confirm understanding before proceeding to new topics
- Speak naturally as if having a conversation
- Avoid listing too many options at once
- Politely redirect the conversation if it goes off-topic
- Be patient and repeat information when needed
- Provide clear next steps after every interaction`;
}