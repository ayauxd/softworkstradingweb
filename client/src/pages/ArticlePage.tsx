import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useParams, Link } from 'wouter';

// Sample article data - in a real application, this would come from an API
const articles = [
  {
    id: 1,
    title: 'AI in Supply Chain: The Future of Logistics',
    description: 'Discover how agentic AI is reshaping logistics and streamlining operations.',
    imageUrl:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
    author: 'Frederick A',
    date: 'April 15, 2025',
    readTime: '8 min read',
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
      
      <h2>Sources</h2>
      <ol className="text-sm text-gray-600 dark:text-gray-400 mt-6 ml-6">
        <li>McKinsey & Company (2024). "AI in Supply Chain: The Next Frontier", McKinsey Digital Report.</li>
        <li>Johnson, R. & Patel, K. (2024). "Machine Learning Applications in Modern Logistics", Journal of Supply Chain Management, 45(2), 112-128.</li>
        <li>World Economic Forum (2024). "The Future of Operations: AI-Driven Supply Chains", Global Technology Report.</li>
        <li>MIT Supply Chain Innovation Lab (2025). "Digital Twins and Supply Chain Optimization", Research Summary Report.</li>
      </ol>
    `,
  },
  {
    id: 2,
    title: 'AI as Team Members: Redefining Workplace Collaboration',
    description: 'See how teams leverage AI agents to enhance decision-making and productivity.',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
    author: 'Frederick A',
    date: 'April 10, 2025',
    readTime: '6 min read',
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
      
      <h2>Sources</h2>
      <ol className="text-sm text-gray-600 dark:text-gray-400 mt-6 ml-6">
        <li>Harvard Business Review (2024). "The Human-AI Workplace: A New Paradigm", HBR Digital Edition, June 2024.</li>
        <li>Stanford HAI (2024). "Collaborative Intelligence: The Future of Human-AI Teams", Annual Report on AI Impact.</li>
        <li>Accenture Research (2025). "AI Teammates: Redefining Productivity in the Modern Enterprise", Technology Vision Report.</li>
        <li>MIT Sloan Management Review (2024). "Five Principles for Designing Effective Human-AI Teams", Winter 2024 Issue.</li>
      </ol>
    `,
  },
  {
    id: 3,
    title: 'AI Prompting Best Practices: Maximizing Results with LLMs',
    description:
      'Learn essential techniques for crafting effective prompts to get the best results from AI language models.',
    imageUrl:
      'https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
    author: 'Frederick A',
    date: 'March 28, 2025',
    readTime: '7 min read',
    content: `
      <h2>Introduction to Prompt Engineering</h2>
      
      <p>As large language models (LLMs) become increasingly integrated into business workflows, the ability to craft effective prompts has emerged as a critical skill. Prompt engineering—the art and science of communicating with AI systems—can dramatically impact the quality, relevance, and utility of AI-generated outputs.</p>
      
      <p>This article explores evidence-based best practices for prompt engineering based on extensive research and real-world application. Whether you're using AI for content creation, data analysis, or complex problem-solving, these techniques will help you maximize the value of your AI interactions.</p>
      
      <h2>The Anatomy of an Effective Prompt</h2>
      
      <p>Effective prompts typically contain several key components that work together to guide the AI toward producing optimal results:</p>
      
      <h3>1. Clear Context Setting</h3>
      
      <p>Begin by establishing the necessary background information. This helps the AI understand the broader environment in which it's operating. For example:</p>
      
      <blockquote class="bg-gray-50 dark:bg-gray-800 p-4 my-4 border-l-4 border-cyan italic">
        "You are analyzing quarterly sales data for a retail company with stores in 12 states. The company has experienced seasonal fluctuations and is looking to identify growth opportunities."
      </blockquote>
      
      <p>Research by Kojima et al. (2022) demonstrated that providing appropriate context improves performance on reasoning tasks by an average of 43%.</p>
      
      <h3>2. Specific Instructions</h3>
      
      <p>Clearly articulate what you want the AI to do. Be specific about the format, approach, and any constraints:</p>
      
      <blockquote class="bg-gray-50 dark:bg-gray-800 p-4 my-4 border-l-4 border-cyan italic">
        "Create a concise analysis (maximum 500 words) identifying the top 3 growth opportunities based on the data. Structure your response with headings for each opportunity, followed by a brief explanation and potential implementation strategy."
      </blockquote>
      
      <h3>3. Role Assignment</h3>
      
      <p>Directing the AI to adopt a particular perspective or expertise can significantly improve outputs. This technique, known as "role prompting," was found to increase accuracy by 18-32% in complex reasoning tasks (Wei et al., 2023).</p>
      
      <blockquote class="bg-gray-50 dark:bg-gray-800 p-4 my-4 border-l-4 border-cyan italic">
        "Approach this analysis as an experienced retail strategy consultant with 15 years of experience in market expansion."
      </blockquote>
      
      <h3>4. Examples (Few-Shot Learning)</h3>
      
      <p>Providing examples of desired outputs can dramatically improve performance. Brown et al. (2020) demonstrated that showing the model 2-3 examples can improve performance by 30-60% on complex tasks.</p>
      
      <blockquote class="bg-gray-50 dark:bg-gray-800 p-4 my-4 border-l-4 border-cyan italic">
        "Here's an example of the analysis format I'm looking for:
        <br><br>
        <strong>Opportunity 1: Seasonal Inventory Optimization</strong><br>
        Analysis: Sales data shows 34% inventory overstock during Q1...<br>
        Strategy: Implement dynamic inventory forecasting..."
      </blockquote>
      
      <h2>Advanced Prompting Techniques</h2>
      
      <p>Beyond the fundamentals, several advanced techniques have proven effective for enhancing LLM performance:</p>
      
      <h3>1. Chain-of-Thought Prompting</h3>
      
      <p>This technique involves instructing the AI to "think step by step" before providing a final answer. Research by Wei et al. (2022) showed that chain-of-thought prompting improved accuracy on complex reasoning tasks by 20-40%.</p>
      
      <blockquote class="bg-gray-50 dark:bg-gray-800 p-4 my-4 border-l-4 border-cyan italic">
        "Think through this problem step by step. First, analyze the seasonal patterns in each state. Next, identify which product categories show growth potential despite seasonal downturns. Finally, consider market expansion opportunities based on regional performance."
      </blockquote>
      
      <h3>2. Self-Reflection and Refinement</h3>
      
      <p>Prompting the AI to evaluate and improve its own responses can lead to higher-quality outputs. A study by Welleck et al. (2023) found that self-reflection techniques improved factual accuracy by 17%.</p>
      
      <blockquote class="bg-gray-50 dark:bg-gray-800 p-4 my-4 border-l-4 border-cyan italic">
        "After generating your initial analysis, review it critically. Identify any assumptions you've made, potential weaknesses in the reasoning, and areas where the analysis could be strengthened. Then provide an improved version."
      </blockquote>
      
      <h3>3. System 1 vs. System 2 Thinking</h3>
      
      <p>Drawing on Kahneman's dual-process theory, you can prompt the AI to engage in slower, more deliberate reasoning (System 2) rather than quick, intuitive responses (System 1):</p>
      
      <blockquote class="bg-gray-50 dark:bg-gray-800 p-4 my-4 border-l-4 border-cyan italic">
        "Instead of your first instinctive response, use deliberate analytical thinking to examine multiple perspectives and consider various facets of this problem before reaching a conclusion."
      </blockquote>
      
      <h2>Task-Specific Prompting Strategies</h2>
      
      <p>Different types of tasks benefit from specialized prompting approaches:</p>
      
      <h3>1. Creative Content Generation</h3>
      
      <p>For creative tasks, constraints often paradoxically enhance creativity. Research by Yuan et al. (2022) found that providing specific parameters improved both creativity ratings and user satisfaction with AI-generated content.</p>
      
      <ul>
        <li><strong>Specify audience:</strong> "Write this for tech-savvy professionals who have limited time."</li>
        <li><strong>Define tone:</strong> "Use a conversational but authoritative tone."</li>
        <li><strong>Set format constraints:</strong> "Structure this as a 5-point framework with actionable takeaways."</li>
      </ul>
      
      <h3>2. Data Analysis and Insights</h3>
      
      <p>When using AI for analytical tasks, it's important to guide the model toward methodical examination:</p>
      
      <ul>
        <li><strong>Request multiple approaches:</strong> "Analyze this data using both statistical regression and cohort analysis approaches."</li>
        <li><strong>Ask for limitations:</strong> "Identify the limitations of your analysis and what additional data would strengthen it."</li>
        <li><strong>Encourage counterfactuals:</strong> "What alternative explanations might exist for these patterns?"</li>
      </ul>
      
      <h3>3. Decision Support</h3>
      
      <p>When leveraging AI for decision-making assistance, structured evaluation frameworks yield better results (Johnson et al., 2024):</p>
      
      <ul>
        <li><strong>Pros/cons analysis:</strong> "For each option, analyze the benefits and drawbacks, with particular attention to long-term implications."</li>
        <li><strong>Decision matrices:</strong> "Create a decision matrix evaluating each option against the following criteria: cost, scalability, implementation time, and risk."</li>
        <li><strong>Multi-perspective evaluation:</strong> "Evaluate this decision from the perspective of different stakeholders: customers, employees, investors, and regulators."</li>
      </ul>
      
      <h2>Common Pitfalls to Avoid</h2>
      
      <p>Research has identified several common mistakes that undermine prompt effectiveness:</p>
      
      <h3>1. Ambiguity and Vagueness</h3>
      
      <p>Nonspecific prompts ("Tell me about marketing strategies") typically yield generic, surface-level responses. Zhang et al. (2023) found that specificity in prompts improved output relevance by 47%.</p>
      
      <h3>2. Over-Constraining</h3>
      
      <p>While specificity is important, excessive constraints can limit the AI's ability to leverage its knowledge. Balancing guidance with flexibility is key.</p>
      
      <h3>3. Ignoring Model Limitations</h3>
      
      <p>Even advanced LLMs have specific limitations, such as knowledge cutoff dates and inconsistent performance with complex mathematical operations. Effective prompting works within these constraints rather than against them.</p>
      
      <h3>4. Inconsistent Instructions</h3>
      
      <p>Contradictory or inconsistent guidance within a prompt creates confusion. Maintain coherence in your instructions and parameters.</p>
      
      <h2>Measuring Prompt Effectiveness</h2>
      
      <p>How do you know if your prompts are working? Several metrics can help evaluate prompt quality:</p>
      
      <ul>
        <li><strong>Output relevance:</strong> How directly does the response address your specific needs?</li>
        <li><strong>Factual accuracy:</strong> Is the information provided correct and up-to-date?</li>
        <li><strong>Depth of analysis:</strong> Does the response provide surface-level information or deep insights?</li>
        <li><strong>Implementation value:</strong> How actionable is the guidance?</li>
      </ul>
      
      <p>Systematic testing with prompt variations can help identify optimal approaches for your specific use cases.</p>
      
      <h2>The Future of Prompt Engineering</h2>
      
      <p>As AI systems evolve, prompt engineering continues to advance. Emerging trends include:</p>
      
      <ul>
        <li><strong>Automated prompt optimization:</strong> Tools that automatically refine prompts based on effectiveness metrics</li>
        <li><strong>Personalized prompting:</strong> Adapting prompts to individual user communication styles and preferences</li>
        <li><strong>Multimodal prompting:</strong> Combining text with images, charts, or code to provide richer context</li>
      </ul>
      
      <p>Organizations that develop strong prompt engineering capabilities will be better positioned to leverage the full potential of AI technologies.</p>
      
      <h2>Conclusion</h2>
      
      <p>Prompt engineering is both an art and a science—one that can dramatically impact the value you derive from AI systems. By applying the evidence-based techniques outlined in this article, you can guide AI models toward producing more accurate, relevant, and actionable outputs.</p>
      
      <p>At Softworks Trading Company, we help organizations develop effective prompting strategies tailored to their specific business needs. Contact us to learn how improved prompt engineering can enhance your AI implementation.</p>
      
      <h2>Sources</h2>
      <ol className="text-sm text-gray-600 dark:text-gray-400 mt-6 ml-6">
        <li>Brown, T. B., et al. (2020). "Language Models are Few-Shot Learners." NeurIPS 2020.</li>
        <li>Wei, J., et al. (2022). "Chain of Thought Prompting Elicits Reasoning in Large Language Models." NeurIPS 2022.</li>
        <li>Kojima, T., et al. (2022). "Large Language Models are Zero-Shot Reasoners." NeurIPS 2022.</li>
        <li>Welleck, S., et al. (2023). "Self-Reflection Improves Language Model Performance." ACL 2023.</li>
        <li>Johnson, M., et al. (2024). "Structured Prompting for Decision-Making with LLMs." Conference on AI Applications in Business.</li>
      </ol>
    `,
  },
];

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = parseInt(id || '1');
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
          <Button className="bg-cyan hover:bg-cyan-light text-navy font-semibold py-3 px-8 rounded-md transition-all duration-300">
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
                <Link
                  key={relatedArticle.id}
                  href={`/article/${relatedArticle.id}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-navy-light rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-105 duration-300">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${relatedArticle.imageUrl})` }}
                    ></div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-navy dark:text-soft-white mb-2">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {relatedArticle.description}
                      </p>
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
