import * as fs from 'fs';
import * as path from 'path';

// Define Industry interface
interface Industry {
  name: string;
  description?: string;
  challenges?: string[];
  solutions?: string[];
}

// Define CompanyInfo interface
interface CompanyInfo {
  company?: {
    name: string;
    description: string;
    tagline: string;
    value_proposition: string;
    mission?: string;
    vision?: string;
    industries_served?: string[];
    contact?: {
      email: string;
      website: string;
    }
  };
  services?: {
    name: string;
    description: string;
    long_description?: string;
    details: string[];
    benefits?: string[];
    duration?: string;
    ideal_for?: string[];
  }[];
  industries?: Industry[];
  faqs?: {
    question: string;
    answer: string;
    category?: string;
    tags?: string[];
  }[];
}

// Path to the knowledge file
const knowledgeFilePath = path.join(process.cwd(), 'server', 'knowledge', 'companyInfo.json');
const backupFilePath = path.join(process.cwd(), 'server', 'knowledge', 'companyInfo.json.backup');

// Empty company info
const emptyCompanyInfo: CompanyInfo = {
  company: {
    name: 'Softworks Trading Company',
    description: 'AI workflow automation specialists',
    tagline: 'Practical AI solutions for real business challenges',
    value_proposition: 'We help businesses adopt AI automation without the complexity',
    contact: {
      email: 'contact@softworkstrading.com',
      website: 'https://softworkstrading.com'
    }
  },
  services: [],
  industries: [],
  faqs: []
};

/**
 * Knowledge service provides access to company information and FAQ data
 */
export const knowledgeService = {
  /**
   * Get company information
   */
  getCompanyInfo: (): CompanyInfo => {
    try {
      // Check if the knowledge file exists
      if (!fs.existsSync(knowledgeFilePath)) {
        console.warn('Company info file not found. Using empty template.');
        return emptyCompanyInfo;
      }
      
      // Read and parse the knowledge file
      const fileContent = fs.readFileSync(knowledgeFilePath, 'utf8');
      const companyInfo = JSON.parse(fileContent);
      
      return companyInfo;
    } catch (error) {
      console.error('Error reading company info:', error);
      
      // Attempt to read backup if available
      try {
        if (fs.existsSync(backupFilePath)) {
          const backupContent = fs.readFileSync(backupFilePath, 'utf8');
          return JSON.parse(backupContent);
        }
      } catch (backupError) {
        console.error('Error reading backup company info:', backupError);
      }
      
      // Return empty template if both files fail
      return emptyCompanyInfo;
    }
  },
  
  /**
   * Get service information by name
   */
  getServiceByName: (serviceName: string) => {
    try {
      const companyInfo = knowledgeService.getCompanyInfo();
      const services = companyInfo.services || [];
      
      return services.find(service => 
        service.name.toLowerCase() === serviceName.toLowerCase() ||
        service.name.toLowerCase().includes(serviceName.toLowerCase())
      );
    } catch (error) {
      console.error('Error getting service info:', error);
      return null;
    }
  },
  
  /**
   * Get industry information
   */
  getIndustryInfo: (industryName?: string): Industry[] | Industry | null => {
    try {
      const companyInfo = knowledgeService.getCompanyInfo();
      const industries = companyInfo.industries || [];
      
      if (industryName) {
        return industries.find((industry: Industry) => 
          industry.name.toLowerCase() === industryName.toLowerCase() ||
          industry.name.toLowerCase().includes(industryName.toLowerCase())
        ) || null;
      }
      
      return industries;
    } catch (error) {
      console.error('Error getting industry info:', error);
      return industryName ? null : [];
    }
  },
  
  /**
   * Get FAQ information
   */
  getFAQs: (category?: string) => {
    try {
      const companyInfo = knowledgeService.getCompanyInfo();
      const faqs = companyInfo.faqs || [];
      
      if (category) {
        return faqs.filter(faq => 
          faq.category?.toLowerCase() === category.toLowerCase()
        );
      }
      
      return faqs;
    } catch (error) {
      console.error('Error getting FAQs:', error);
      return [];
    }
  },
  
  /**
   * Generates a system prompt for AI services
   */
  generateSystemPrompt: (type: 'standard' | 'detailed' | 'concise' = 'standard'): string => {
    try {
      const companyInfo = knowledgeService.getCompanyInfo();
      
      // Get company basics
      const company = companyInfo.company || emptyCompanyInfo.company;
      const services = companyInfo.services || [];
      
      // Base prompt with company information
      let prompt = `You are an AI assistant for ${company?.name || 'Softworks Trading Company'}, ${company?.description || 'AI workflow automation specialists'}. ${company?.tagline || 'Practical AI solutions for real business challenges'}.\n\n`;
      
      // Add value proposition
      prompt += `Our value proposition: ${company?.value_proposition || 'We help businesses adopt AI automation without the complexity'}\n\n`;
      
      // Add services information based on prompt detail level
      if (type === 'detailed') {
        // Detailed prompt with full service descriptions
        prompt += `## Our Services\n\n`;
        
        services.forEach(service => {
          prompt += `### ${service.name}\n`;
          prompt += `${service.description}\n\n`;
          
          if (service.long_description) {
            prompt += `${service.long_description}\n\n`;
          }
          
          if (service.details && service.details.length > 0) {
            prompt += `Details:\n`;
            service.details.forEach(detail => {
              prompt += `- ${detail}\n`;
            });
            prompt += `\n`;
          }
          
          if (service.benefits && service.benefits.length > 0) {
            prompt += `Benefits:\n`;
            service.benefits.forEach(benefit => {
              prompt += `- ${benefit}\n`;
            });
            prompt += `\n`;
          }
        });
      } else if (type === 'standard') {
        // Standard prompt with basic service info
        prompt += `Our services include:\n`;
        
        services.forEach(service => {
          prompt += `- ${service.name}: ${service.description}\n`;
        });
        
        prompt += `\n`;
      } else {
        // Concise prompt with just service names
        prompt += `Our services: ${services.map(s => s.name).join(', ')}\n\n`;
      }
      
      // Guidelines for the AI assistant
      prompt += `Guidelines:\n`;
      prompt += `- Be helpful, clear, and concise in your responses.\n`;
      prompt += `- Emphasize the practical business value of AI automation.\n`;
      prompt += `- Focus on real-world applications rather than theoretical possibilities.\n`;
      prompt += `- Don't make promises that AI can't deliver on.\n`;
      prompt += `- If you don't know an answer, say so rather than making something up.\n`;
      prompt += `- Always maintain a professional, business-focused tone.\n`;
      
      return prompt;
    } catch (error) {
      console.error('Error generating system prompt:', error);
      
      // Return a basic prompt if there's an error
      return `You are an AI assistant for Softworks Trading Company. Be helpful, clear, and professional in your responses.`;
    }
  }
};