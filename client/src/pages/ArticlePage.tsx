import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useParams, Link } from "wouter";

// Sample article data - in a real application, this would come from an API
const articles = [
  {
    id: 1,
    title: "AI in Supply Chain: The Future of Logistics",
    description: "Discover how agentic AI is reshaping logistics and streamlining operations.",
    imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHN1cHBseSUyMGNoYWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    author: "Dr. Emily Chen",
    date: "April 15, 2025",
    readTime: "8 min read",
    content: `
      <h2>The Evolution of Supply Chain Management</h2>
      
      <p>Supply chain management has undergone several transformations in recent decades, from manual processes to digital systems, and now to intelligent, self-optimizing networks powered by artificial intelligence.</p>
      
      <p>In today's hypercompetitive global marketplace, businesses can no longer rely on traditional supply chain methods. The combination of increasing customer expectations, geopolitical uncertainties, and market volatility demands a new approach to logistics and operations management.</p>
      
      <p>Enter AI-driven supply chain solutions – the next frontier in operational excellence.</p>
      
      <h2>The Problem with Traditional Supply Chains</h2>
      
      <p>Traditional supply chains suffer from several inherent limitations:</p>
      
      <ul>
        <li><strong>Reactive rather than proactive</strong>: Responding to disruptions after they occur instead of anticipating and preventing them</li>
        <li><strong>Limited visibility</strong>: Siloed data across different parts of the supply chain</li>
        <li><strong>Manual decision-making</strong>: Relying on human judgment for complex optimization problems</li>
        <li><strong>Inefficient resource allocation</strong>: Suboptimal inventory levels and transportation routes</li>
      </ul>
      
      <p>These limitations result in higher costs, longer lead times, and reduced customer satisfaction.</p>
      
      <h2>How AI is Transforming Supply Chain Operations</h2>
      
      <p>Artificial intelligence, particularly when deployed as agentic systems, is addressing these challenges by creating self-optimizing supply chains that can think, learn, and adapt.</p>
      
      <h3>1. Demand Forecasting</h3>
      
      <p>AI algorithms analyze historical sales data, seasonal trends, macroeconomic indicators, and even social media sentiment to predict future demand with unprecedented accuracy. Unlike traditional statistical methods, machine learning models can identify complex, non-linear patterns and continuously improve their predictions.</p>
      
      <p>One manufacturing client implemented our AI forecasting system and reduced forecast error by 37%, directly translating to a 22% reduction in excess inventory costs.</p>
      
      <h3>2. Inventory Optimization</h3>
      
      <p>AI-powered inventory management systems dynamically adjust safety stock levels based on demand volatility, lead time uncertainty, and service level requirements. These systems can optimize inventory across multiple echelons of the supply chain, considering complex interdependencies between different products and locations.</p>
      
      <h3>3. Intelligent Routing and Logistics</h3>
      
      <p>Route optimization has evolved from simple distance-based calculations to sophisticated algorithms that consider traffic patterns, weather conditions, delivery time windows, vehicle capacity constraints, and driver availability. AI systems can reoptimize routes in real-time as conditions change, ensuring on-time deliveries while minimizing transportation costs.</p>
      
      <h3>4. Autonomous Supply Chain Agents</h3>
      
      <p>Perhaps the most transformative application of AI in supply chain is the emergence of autonomous agents that can make decisions without human intervention. These agents monitor the supply chain continuously, identify potential disruptions, evaluate alternative solutions, and implement corrective actions – all at machine speed.</p>
      
      <h2>Case Study: Global Consumer Goods Manufacturer</h2>
      
      <p>A leading consumer goods company implemented our AI-driven supply chain platform with the following results:</p>
      
      <ul>
        <li>29% reduction in safety stock inventory</li>
        <li>18% decrease in transportation costs</li>
        <li>42% faster response to supply disruptions</li>
        <li>15% improvement in perfect order rate</li>
      </ul>
      
      <p>The platform continuously monitors their global supply network, automatically adjusts inventory levels and transportation plans, and alerts human operators only when exceptions require strategic decisions.</p>
      
      <h2>Implementation Roadmap</h2>
      
      <p>Implementing AI in your supply chain doesn't require a complete overhaul of your existing systems. We recommend a phased approach:</p>
      
      <ol>
        <li><strong>Data foundation</strong>: Ensure data quality and accessibility across your supply chain</li>
        <li><strong>Single-function pilots</strong>: Implement AI in specific areas like demand forecasting or inventory optimization</li>
        <li><strong>Cross-functional integration</strong>: Connect AI systems across functions to capture synergies</li>
        <li><strong>Autonomous orchestration</strong>: Enable AI agents to make routine decisions without human intervention</li>
      </ol>
      
      <h2>The Future of AI in Supply Chain</h2>
      
      <p>As AI technology continues to advance, we see several emerging trends:</p>
      
      <ul>
        <li><strong>Digital twins</strong>: Virtual replicas of the physical supply chain that enable scenario planning and optimization</li>
        <li><strong>Blockchain integration</strong>: Combining AI with blockchain for transparent, secure supply chain transactions</li>
        <li><strong>Generative AI for supply chain design</strong>: AI systems that can design optimal supply chain networks from scratch</li>
        <li><strong>Sustainability optimization</strong>: AI algorithms that minimize environmental impact while maintaining service levels</li>
      </ul>
      
      <h2>Getting Started</h2>
      
      <p>The journey toward an AI-powered supply chain begins with a clear assessment of your current capabilities and a strategic roadmap for transformation.</p>
      
      <p>At Softworks Trading Company, we specialize in helping businesses implement practical AI solutions that deliver measurable results. Our team of supply chain experts and AI engineers work side-by-side with your team to ensure successful implementation and knowledge transfer.</p>
      
      <p>Contact us today to schedule a supply chain assessment and discover how AI can transform your operations.</p>
    `
  },
  {
    id: 2,
    title: "AI as Team Members: Redefining Workplace Collaboration",
    description: "See how teams leverage AI agents to enhance decision-making and productivity.",
    imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWklMjBjb2xsYWJvcmF0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    author: "Michael Roberts",
    date: "April 10, 2025",
    readTime: "6 min read",
    content: `
      <h2>The New Team Dynamic: Humans + AI</h2>
      
      <p>The modern workplace is undergoing a fundamental transformation. Artificial Intelligence is no longer just a tool that teams use; it's becoming an integral team member that collaborates, contributes, and complements human capabilities.</p>
      
      <p>This shift represents a new paradigm in how work gets done. Rather than viewing AI as something that replaces human workers, forward-thinking organizations are integrating AI agents as collaborative partners that enhance human potential.</p>
      
      <h2>Beyond Automation: AI as a Creative Partner</h2>
      
      <p>The first wave of workplace AI focused primarily on automation—handling repetitive tasks to free up human time. While valuable, this application merely scratches the surface of AI's potential.</p>
      
      <p>Today's AI systems can contribute at a much higher level:</p>
      
      <ul>
        <li><strong>Idea generation</strong>: Proposing creative solutions and novel approaches</li>
        <li><strong>Decision support</strong>: Analyzing complex data sets to inform strategic choices</li>
        <li><strong>Knowledge augmentation</strong>: Extending human expertise with specialized knowledge</li>
        <li><strong>Collaboration facilitation</strong>: Bridging communication gaps between team members</li>
      </ul>
      
      <h2>Real-World Examples of Human-AI Teams</h2>
      
      <h3>1. Creative Teams with AI Co-pilots</h3>
      
      <p>Design studios and marketing agencies are pairing designers with AI systems that can generate initial concepts, variations, and alternatives. Human designers provide creative direction, refine outputs, and make final aesthetic judgments, while AI expands the exploration space and handles technical execution.</p>
      
      <p>One advertising agency we work with reported a 300% increase in the number of campaign concepts they could explore, leading to more innovative solutions for their clients.</p>
      
      <h3>2. Research Teams with AI Knowledge Navigators</h3>
      
      <p>Research organizations are using AI agents to scan vast literature databases, identify relevant studies, summarize findings, and even suggest experimental designs. Human researchers define research questions, interpret results, and make scientific judgments, while AI accelerates the discovery process.</p>
      
      <h3>3. Customer Service Teams with AI Relationship Managers</h3>
      
      <p>Customer service departments are creating hybrid teams where AI agents handle routine inquiries and transaction processing, while human agents focus on complex problem-solving and emotional connection. AI systems can also provide real-time guidance to human agents, suggesting solutions and relevant information during customer interactions.</p>
      
      <h2>Designing Effective Human-AI Teams</h2>
      
      <p>Creating productive partnerships between humans and AI requires thoughtful design. Based on our experience implementing AI team members across various organizations, we recommend the following principles:</p>
      
      <h3>1. Clear Role Definition</h3>
      
      <p>Define specific responsibilities for human and AI team members based on their respective strengths. Humans excel at empathy, ethical judgment, creative thinking, and handling ambiguity. AI excels at data processing, pattern recognition, consistency, and tireless execution.</p>
      
      <h3>2. Transparent AI Capabilities</h3>
      
      <p>Ensure human team members understand what the AI can and cannot do. Unrealistic expectations lead to frustration, while underestimating AI capabilities leaves value on the table.</p>
      
      <h3>3. Human-Centered Workflows</h3>
      
      <p>Design interaction patterns that feel natural and intuitive for human team members. The goal is to reduce cognitive load, not increase it.</p>
      
      <h3>4. Continuous Learning</h3>
      
      <p>Implement feedback loops that allow both humans and AI to improve over time. Human feedback helps the AI adapt to team needs, while AI insights help humans develop new skills.</p>
      
      <h2>Case Study: Financial Advisory Firm</h2>
      
      <p>A wealth management firm implemented AI team members to work alongside their financial advisors with remarkable results:</p>
      
      <ul>
        <li>Advisors now serve 40% more clients while providing more personalized service</li>
        <li>Client portfolio analysis depth increased by 3x</li>
        <li>Time spent on administrative tasks decreased by 70%</li>
        <li>Client satisfaction scores improved by 22 points</li>
      </ul>
      
      <p>The firm's approach involved pairing each advisor with an AI agent that handled research, report generation, and initial investment recommendations. Advisors focused on client relationships, strategic guidance, and final decision-making.</p>
      
      <h2>Implementation Strategies</h2>
      
      <p>Introducing AI team members requires careful change management. We recommend a phased approach:</p>
      
      <ol>
        <li><strong>Assessment</strong>: Identify specific workflows where human-AI collaboration would add the most value</li>
        <li><strong>Pilot</strong>: Start with a small team and a narrowly defined use case</li>
        <li><strong>Training</strong>: Provide comprehensive training on how to work effectively with AI teammates</li>
        <li><strong>Expansion</strong>: Gradually extend to more teams and broader responsibilities</li>
        <li><strong>Optimization</strong>: Continuously refine roles and interaction patterns based on feedback</li>
      </ol>
      
      <h2>The Future of Work is Collaborative</h2>
      
      <p>As AI capabilities continue to advance, the boundary between human and AI responsibilities will evolve. However, the most successful organizations will not be those that simply replace humans with AI, but those that create effective human-AI teams that leverage the unique strengths of both.</p>
      
      <p>The workplace of tomorrow will be neither human-only nor AI-only—it will be collaborative, with each enhancing the capabilities of the other.</p>
      
      <p>At Softworks Trading Company, we help organizations design and implement effective human-AI teams. Contact us to learn how your team can benefit from AI collaboration.</p>
    `
  },
  {
    id: 3,
    title: "Fortune 500 Workflow Case Study: 40% Efficiency Gains",
    description: "Learn how we helped a Fortune 500 firm gain 40% efficiency with smart automation.",
    imageUrl: "https://images.unsplash.com/photo-1453906971074-ce568cccbc63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhc2UlMjBzdHVkeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    author: "Jessica Williams",
    date: "March 28, 2025",
    readTime: "5 min read",
    content: `
      <h2>Executive Summary</h2>
      
      <p>This case study details how Softworks Trading Company helped a Fortune 500 manufacturing firm transform their operational workflows through strategic AI implementation, resulting in a 40% gain in overall process efficiency, $4.2M in annual cost savings, and significantly improved employee satisfaction.</p>
      
      <h2>Client Challenge</h2>
      
      <p>Our client, a global leader in industrial manufacturing with over 50,000 employees and $12B in annual revenue, was facing several critical challenges:</p>
      
      <ul>
        <li><strong>Process inefficiency</strong>: Workflows spanning engineering, procurement, and customer service involved significant manual effort and duplicate data entry</li>
        <li><strong>Knowledge silos</strong>: Critical information was trapped in emails, disparate systems, and individual employees' expertise</li>
        <li><strong>Decision bottlenecks</strong>: Routine approvals and decisions required executive input, creating delays</li>
        <li><strong>Scaling challenges</strong>: Growing order volume was straining existing processes and systems</li>
      </ul>
      
      <p>Most concerning, employee surveys indicated growing frustration with administrative burden, with knowledge workers reporting that 60% of their time was spent on low-value tasks rather than their core expertise.</p>
      
      <h2>Our Approach</h2>
      
      <p>Rather than implementing a massive, disruptive transformation, we took a targeted, surgical approach focused on identifying and optimizing high-impact workflows:</p>
      
      <h3>Phase 1: Workflow Diagnostics (4 weeks)</h3>
      
      <p>We began with a comprehensive analysis of existing workflows, identifying pain points, bottlenecks, and optimization opportunities. Our proprietary Workflow Intelligence Platform analyzed process data, communication patterns, and system interactions to create a detailed efficiency map.</p>
      
      <p>Key findings included:</p>
      <ul>
        <li>Engineering change orders required an average of 23 manual steps and 12 days to complete</li>
        <li>Customer inquiries were handled by an average of 3.5 different employees before resolution</li>
        <li>80% of procurement exceptions followed predictable patterns but still required manual review</li>
        <li>Technical documentation was fragmented across 17 different systems</li>
      </ul>
      
      <h3>Phase 2: AI Workflow Design (6 weeks)</h3>
      
      <p>Based on our diagnostic findings, we designed a set of AI-enhanced workflows targeting the most significant inefficiencies. Each workflow redesign focused on:</p>
      
      <ul>
        <li><strong>Data integration</strong>: Connecting previously siloed information sources</li>
        <li><strong>Intelligent automation</strong>: Deploying AI agents to handle routine decisions and tasks</li>
        <li><strong>Human-AI collaboration</strong>: Creating interfaces where employees could effectively partner with AI systems</li>
        <li><strong>Knowledge capture and distribution</strong>: Implementing systems to document and share institutional knowledge</li>
      </ul>
      
      <h3>Phase 3: Agile Implementation (12 weeks)</h3>
      
      <p>We implemented the new workflows in rapid succession, using a sprint-based approach that delivered value incrementally rather than requiring a "big bang" cutover. Each implementation sprint included:</p>
      
      <ul>
        <li>Technical deployment of required AI capabilities</li>
        <li>Integration with existing systems and data sources</li>
        <li>Training and change management for affected employees</li>
        <li>Performance measurement and optimization</li>
      </ul>
      
      <h2>Solution Components</h2>
      
      <p>Our solution combined several AI technologies to create a comprehensive workflow optimization platform:</p>
      
      <h3>1. Intelligent Document Processing</h3>
      
      <p>We deployed advanced document understanding AI to automatically extract, classify, and route information from technical specifications, purchase orders, customer inquiries, and internal documentation. The system could understand both structured forms and unstructured text, converting previously manual document handling into a streamlined digital process.</p>
      
      <h3>2. Decision Automation Agents</h3>
      
      <p>For routine decisions that previously required human judgment, we implemented AI decision agents trained on historical data and explicit business rules. These agents could handle approvals, exception routing, and prioritization, escalating only truly unusual cases to human experts.</p>
      
      <h3>3. Knowledge Management System</h3>
      
      <p>We created a centralized knowledge repository with intelligent retrieval capabilities. The system could answer employee questions, suggest relevant documentation, and even draft responses to common inquiries. Importantly, it also captured new information and solutions as they were developed, continuously expanding the organization's collective intelligence.</p>
      
      <h3>4. Predictive Workflow Optimization</h3>
      
      <p>Our platform continuously analyzed workflow performance data to identify additional optimization opportunities and predict potential bottlenecks before they occurred. This allowed for proactive resource allocation and process refinement.</p>
      
      <h2>Results</h2>
      
      <p>The implementation delivered exceptional results across multiple dimensions:</p>
      
      <h3>Efficiency Gains</h3>
      <ul>
        <li>40% overall reduction in process cycle time</li>
        <li>Engineering change orders completed in 3 days (down from 12)</li>
        <li>Customer inquiry resolution time reduced by 65%</li>
        <li>Procurement exception handling time reduced by 78%</li>
      </ul>
      
      <h3>Financial Impact</h3>
      <ul>
        <li>$4.2M annual cost savings from reduced manual effort</li>
        <li>$1.8M savings from improved procurement decisions</li>
        <li>15% reduction in engineering rework costs</li>
        <li>22% decrease in customer service escalations</li>
      </ul>
      
      <h3>Employee Experience</h3>
      <ul>
        <li>Knowledge workers reported spending 70% of time on core expertise (up from 40%)</li>
        <li>Employee satisfaction scores increased by 31 points</li>
        <li>Time spent searching for information decreased by 83%</li>
        <li>New employee onboarding time reduced by 40%</li>
      </ul>
      
      <h2>Key Success Factors</h2>
      
      <p>Several factors were critical to achieving these impressive results:</p>
      
      <ul>
        <li><strong>Executive sponsorship</strong>: Strong leadership support enabled quick decision-making and resource allocation</li>
        <li><strong>Employee involvement</strong>: Front-line workers participated in workflow design, ensuring practical solutions</li>
        <li><strong>Targeted scope</strong>: Focus on high-impact workflows delivered meaningful results quickly</li>
        <li><strong>Balanced automation</strong>: AI handled routine tasks while humans focused on judgment and creativity</li>
        <li><strong>Continuous improvement</strong>: Ongoing measurement and refinement of workflows</li>
      </ul>
      
      <h2>Next Steps</h2>
      
      <p>Building on the success of this initial implementation, the client is now expanding the AI workflow platform to additional departments and processes. We continue to partner with them on this journey, with a projected additional $7M in annual savings over the next phase.</p>
      
      <p>To learn how Softworks Trading Company can help your organization achieve similar results, contact our workflow experts for a consultation.</p>
    `
  }
];

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = parseInt(id || "1");
  const article = articles.find(a => a.id === articleId) || articles[0];
  
  // Scroll to top when navigating to an article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  return (
    <div className="bg-soft-white dark:bg-navy min-h-screen">
      {/* Hero Section with Article Image */}
      <div className="w-full h-96 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${article.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-10 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-2 text-cyan mb-4">
              <Link href="/#insights" className="text-cyan hover:text-cyan-light transition">
                ← Back to Insights
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center text-gray-300 gap-4 md:gap-6">
              <div className="flex items-center">
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center">
                <span>{article.date}</span>
              </div>
              <div className="flex items-center">
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-navy-light shadow-lg rounded-lg p-8 mb-8">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto bg-navy dark:bg-navy-dark text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to transform your workflows?</h3>
          <p className="mb-6">
            Let our experts show you how AI can help your business achieve similar results.
          </p>
          <Button 
            className="bg-cyan hover:bg-cyan-light text-navy font-semibold py-3 px-8 rounded-md transition-all duration-300"
          >
            Schedule a Consultation
          </Button>
        </div>

        {/* More Articles */}
        <div className="max-w-3xl mx-auto mt-12">
          <h3 className="text-2xl font-bold mb-6 text-navy dark:text-soft-white">More Insights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {articles
              .filter(a => a.id !== articleId)
              .slice(0, 2)
              .map(relatedArticle => (
                <Link key={relatedArticle.id} href={`/article/${relatedArticle.id}`} className="block group">
                  <div className="bg-white dark:bg-navy-light rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-105 duration-300">
                    <div 
                      className="h-48 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${relatedArticle.imageUrl})` }}
                    ></div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-navy dark:text-soft-white mb-2">{relatedArticle.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{relatedArticle.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}