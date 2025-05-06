// render-static.js - Static prerendering script for SEO-friendly HTML
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerenderRoutes() {
  try {
    console.log('Starting static prerendering...');
    
    // Define routes to prerender
    const routes = [
      '/',
      '/blog',
      // Add more routes as needed
    ];
    
    console.log(`Will prerender ${routes.length} routes`);
    
    // Make sure the build directory exists
    const distPath = path.join(__dirname, 'dist', 'public');
    const indexPath = path.join(distPath, 'index.html');
    
    // Read the index.html template
    console.log(`Reading template from ${indexPath}`);
    const template = await fs.readFile(indexPath, 'utf8');
    
    // Create DOM from template
    const dom = new JSDOM(template);
    const document = dom.window.document;
    
    // For each route, render the App component and replace the root div content
    for (const route of routes) {
      console.log(`Prerendering route: ${route}`);
      
      try {
        // Find the root element
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          throw new Error('Root element not found in HTML template');
        }
        
        // Insert pre-rendered HTML matching the app structure
        rootElement.innerHTML = generateStaticHTML(route);
        
        // Write the prerendered HTML to disk
        let outputPath;
        if (route === '/') {
          outputPath = path.join(distPath, 'index.html');
        } else {
          // Create directory for route (e.g., /blog/ directory)
          const routeDir = path.join(distPath, route.substring(1));
          await fs.mkdir(routeDir, { recursive: true });
          outputPath = path.join(routeDir, 'index.html');
        }
        
        await fs.writeFile(outputPath, dom.serialize());
        console.log(`Prerendered ${route} to ${outputPath}`);
      } catch (error) {
        console.error(`Error prerendering route ${route}:`, error);
      }
    }
    
    console.log('Static prerendering completed!');
  } catch (error) {
    console.error('Prerendering failed:', error);
    process.exit(1);
  }
}

// Generate static HTML that matches our App structure for different routes
function generateStaticHTML(route) {
  if (route === '/') {
    return `
      <header class="fixed top-0 left-0 w-full bg-soft-white dark:bg-navy shadow-md z-50 transition-all duration-300">
        <div class="container mx-auto px-4 flex justify-between items-center h-16">
          <a href="/" class="flex items-center space-x-2" aria-label="Softworks Trading Company">
            <img src="/assets/logo.png" alt="Softworks Trading Company Logo" class="h-10 w-auto" />
          </a>
          <nav class="hidden md:flex space-x-6">
            <a href="/#services" class="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan transition-colors">Services</a>
            <a href="/#how-it-works" class="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan transition-colors">How It Works</a>
            <a href="/blog" class="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan transition-colors">Insights</a>
            <a href="/#contact" class="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan transition-colors">Contact</a>
          </nav>
        </div>
      </header>
      <main id="main-content" class="pt-16 flex-grow">
        <section id="home" class="relative min-h-[90vh] bg-[#0D3456] dark:bg-[#051525] text-soft-white pt-36 md:pt-32 pb-20 transition-colors duration-300 overflow-hidden flex items-center">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fadeIn text-white dark:text-gray-100">
                Automate Your Business With
                <span class="bg-gradient-to-r from-cyan to-cyan-light bg-clip-text text-transparent">
                  Practical
                </span>
                AI Solutions
              </h1>
              <p class="text-xl md:text-2xl mb-10 text-gray-200 dark:text-gray-300 animate-slideUp">
                Streamline your operations with AI workflows that deliver measurable results in days, not months.
              </p>
              <div class="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button class="bg-cyan hover:bg-cyan-light text-navy font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-all">
                  Learn How We Can Assist You
                </button>
                <button class="bg-navy/40 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-navy font-semibold text-sm md:text-base py-3 px-8 rounded-md transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
        <section id="services" class="w-full bg-[#F9FAFC] dark:bg-[#1F2937] py-24">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Our Services</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white dark:bg-navy-dark p-6 rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-4">AI Strategy Consultation</h3>
                <p>Discover the most impactful AI opportunities for your business with our expert consultation.</p>
              </div>
              <div class="bg-white dark:bg-navy-dark p-6 rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Rapid Automation Deployment</h3>
                <p>Transform manual processes into intelligent workflows that save time and reduce errors.</p>
              </div>
              <div class="bg-white dark:bg-navy-dark p-6 rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Founder's Workflow Coaching</h3>
                <p>Personalized guidance to integrate AI tools into your daily operations for maximum impact.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer class="bg-navy dark:bg-navy-dark text-white py-12">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between">
            <div>
              <img src="/assets/logo-white.svg" alt="Softworks Trading Company" class="h-10 w-auto mb-4" />
              <p class="max-w-md text-gray-300">Helping businesses implement practical AI solutions that deliver measurable results.</p>
            </div>
          </div>
          <div class="mt-8 pt-8 border-t border-gray-700">
            <p class="text-center text-gray-400">&copy; 2025 Softworks Trading Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  } else if (route === '/blog') {
    return `
      <header class="fixed top-0 left-0 w-full bg-soft-white dark:bg-navy shadow-md z-50 transition-all duration-300">
        <div class="container mx-auto px-4 flex justify-between items-center h-16">
          <a href="/" class="flex items-center space-x-2" aria-label="Softworks Trading Company">
            <img src="/assets/logo.png" alt="Softworks Trading Company Logo" class="h-10 w-auto" />
          </a>
          <nav class="hidden md:flex space-x-6">
            <a href="/#services" class="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan transition-colors">Services</a>
            <a href="/#how-it-works" class="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan transition-colors">How It Works</a>
            <a href="/blog" class="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan transition-colors">Insights</a>
            <a href="/#contact" class="text-navy dark:text-soft-white hover:text-cyan dark:hover:text-cyan transition-colors">Contact</a>
          </nav>
        </div>
      </header>
      <main id="main-content" class="pt-16 flex-grow">
        <div class="container mx-auto px-4 py-16">
          <h1 class="text-3xl font-bold mb-8">Insights & Articles</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article class="bg-white dark:bg-navy-dark rounded-lg overflow-hidden shadow-lg">
              <img src="/optimized-images/articles/ai-prompting.webp" alt="AI Prompting Strategies" class="w-full h-48 object-cover" />
              <div class="p-6">
                <h2 class="text-xl font-semibold mb-2">AI Prompting Strategies for Business</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-4">Learn how to craft effective prompts that get predictable results from AI tools.</p>
                <a href="/article/1/ai-prompting-strategies" class="text-cyan hover:text-cyan-light transition-colors">Read More</a>
              </div>
            </article>
            <article class="bg-white dark:bg-navy-dark rounded-lg overflow-hidden shadow-lg">
              <img src="/optimized-images/articles/connected-intelligence.webp" alt="Connected Intelligence" class="w-full h-48 object-cover" />
              <div class="p-6">
                <h2 class="text-xl font-semibold mb-2">Connected Intelligence: The Future of Business</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-4">How interconnected AI systems are transforming business operations.</p>
                <a href="/article/2/connected-intelligence" class="text-cyan hover:text-cyan-light transition-colors">Read More</a>
              </div>
            </article>
            <article class="bg-white dark:bg-navy-dark rounded-lg overflow-hidden shadow-lg">
              <img src="/optimized-images/articles/supply-chain.webp" alt="Supply Chain Optimization" class="w-full h-48 object-cover" />
              <div class="p-6">
                <h2 class="text-xl font-semibold mb-2">Supply Chain Optimization with AI</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-4">Streamlining supply chains using predictive analytics and machine learning.</p>
                <a href="/article/3/supply-chain-optimization" class="text-cyan hover:text-cyan-light transition-colors">Read More</a>
              </div>
            </article>
          </div>
        </div>
      </main>
      <footer class="bg-navy dark:bg-navy-dark text-white py-12">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between">
            <div>
              <img src="/assets/logo-white.svg" alt="Softworks Trading Company" class="h-10 w-auto mb-4" />
              <p class="max-w-md text-gray-300">Helping businesses implement practical AI solutions that deliver measurable results.</p>
            </div>
          </div>
          <div class="mt-8 pt-8 border-t border-gray-700">
            <p class="text-center text-gray-400">&copy; 2025 Softworks Trading Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }
  
  // Default content for other routes
  return `<div class="min-h-screen flex flex-col bg-soft-white dark:bg-navy text-navy dark:text-soft-white">
    <header class="fixed top-0 left-0 w-full bg-soft-white dark:bg-navy shadow-md z-50 transition-all duration-300">
      <div class="container mx-auto px-4 flex justify-between items-center h-16">
        <a href="/" class="flex items-center space-x-2" aria-label="Softworks Trading Company">
          <img src="/assets/logo.png" alt="Softworks Trading Company Logo" class="h-10 w-auto" />
        </a>
      </div>
    </header>
    <main id="main-content" class="pt-16 flex-grow container mx-auto px-4 py-16">
      <h1 class="text-3xl font-bold mb-8">Loading Content...</h1>
    </main>
    <footer class="bg-navy dark:bg-navy-dark text-white py-12">
      <div class="container mx-auto px-4">
        <p class="text-center text-gray-400">&copy; 2025 Softworks Trading Company. All rights reserved.</p>
      </div>
    </footer>
  </div>`;
}

// Run the function if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderRoutes();
}

export default prerenderRoutes;