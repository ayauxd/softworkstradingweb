// This script ensures that key data files exist before the build process
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the paths
const dataDir = path.join(__dirname, 'client', 'src', 'data');
const articlesFile = path.join(dataDir, 'articles.ts');

// Create basic article data if needed
const basicArticleData = `// Default article data
export const articles = [
  {
    id: 1,
    title: 'AI in Supply Chain: The Future of Logistics',
    description: 'Discover how agentic AI is reshaping logistics and streamlining operations.',
    imageUrl: '/assets/images/articles/supply-chain.png',
    author: "Frederick A",
    date: 'April 15, 2025',
    readTime: '5 min read',
    content: '<h2>The Evolution of Supply Chain Management</h2><p>Supply chain management has undergone several transformations in recent decades.</p>'
  },
  {
    id: 2,
    title: 'Connected Intelligence: Building Collaborative AI-Human Teams',
    description: 'See how teams leverage AI agents to enhance decision-making and productivity.',
    imageUrl: '/assets/images/articles/connected-intelligence.png',
    author: "Frederick A",
    date: 'April 10, 2025',
    readTime: '4 min read',
    content: '<h2>The New Team Dynamic: Humans + AI</h2><p>The workplace is undergoing a fundamental transformation.</p>'
  }
];
`;

// Ensure the data directory exists
console.log(`Checking for data directory: ${dataDir}`);
if (!fs.existsSync(dataDir)) {
  console.log(`Creating data directory: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure the articles file exists
console.log(`Checking for articles file: ${articlesFile}`);
if (!fs.existsSync(articlesFile)) {
  console.log(`Creating articles file: ${articlesFile}`);
  fs.writeFileSync(articlesFile, basicArticleData);
  console.log('Articles data file created with default content');
} else {
  console.log('Articles data file already exists');
}

console.log('Data verification complete ✅');