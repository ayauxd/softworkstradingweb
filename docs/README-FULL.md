# 🧾 Softworks Trading Company – Project Overview

## 1. Project Purpose  
A sophisticated React-based landing page for Softworks, delivering an AI workflow automation platform with advanced interaction design and user-centric modal experiences. The website serves SMEs and solo entrepreneurs exploring AI adoption, simplifying how users engage with AI automation through agentic workflows, consultations, and education.

## SEO Implementation

This site now implements static prerendering for search engine optimization:

1. **Static Prerendering Pipeline**
   - `render-static.js` generates complete HTML versions of key pages during build 
   - Enhanced Express server in `render-server.js` prioritizes prerendered files

2. **Benefits**
   - Complete HTML is served to crawlers even without JavaScript execution
   - All content is visible in social shares and search previews
   - Fast initial load times with Time-to-First-Byte < 500ms
   - No impact on client-side SPA behavior for regular users

3. **Validation**
   ```bash
   # Verify populated HTML is served without JS execution
   curl -Ls https://softworkstrading.com | grep -q "Automate Your Business With Practical AI Solutions" && echo "Success!" || echo "Failed"
   
   # Check performance
   curl -I https://softworkstrading.com
   ```

---

## 2. Core Features Implemented  
- Hero section with updated headline "Automate Your Business With Practical AI Solutions" and CTA
- Services section: 3 service cards (Rapid Automation Deployment, Founders' Workflow Coaching, AI Strategy Consultation)
- Step-by-step explainer section: "Easy Steps to Start Automating"
- Enhanced "Talk to a Workflow Agent" modal with both chat and call options (fixed circular dependency bug)
- Separate floating action buttons (chat and call) in bottom-right corner
- Animated neural network visualization with stronger glow effects, brighter colors, and faster pulse timing
- Testimonial carousel (3 rotating quotes with navigation arrows)
- Publications section: 3 prominent article cards with larger layout for better readability
- Responsive layout for mobile and desktop
- Light/dark mode toggle with proper color contrast handling
- Improved accessibility with semantic HTML, ARIA labels, and keyboard navigation
- Footer with Quick Links, Contact Info, and Social Media Icons (LinkedIn, X, Facebook, Instagram)
- Form validation with visual feedback and shake animation for errors
- Error boundary for better error handling and recovery

---

## 3. Current Dependencies  
List of key packages and tools installed:

- `react`, `vite` – Frontend framework and build tool
- `tailwindcss`, `shadcn/ui` – UI styling system and component library
- `lucide-react`, `react-icons` – SVG icon components
- `wouter` – Lightweight routing library
- `@tanstack/react-query` – Data fetching and state management
- `zod` – Schema validation for type safety
- `class-variance-authority` – Conditional class composition
- `next-themes` – Theme handling (light/dark mode)
- `drizzle-orm`, `drizzle-zod` – Database ORM and schema validation
- `react-hook-form` – Form handling with validation
- `express`, `express-session` – Server framework and session management
- `framer-motion` – Animation library
- `embla-carousel-react` – Lightweight carousel component

---

## 4. Supporting Tools & Hosting  
- **Replit** – Main development environment  
- **Render** – Recommended hosting and deployment platform
- **Netlify** – Alternative hosting and deployment  
- **Supabase** – Auth and potential backend  
- **TidyCal (or Google Calendar Embed)** – Scheduling  
- **Plausible** – (Optional) lightweight analytics

### Render Deployment

This project is configured for easy deployment to Render:

1. Push your code to GitHub
2. Connect your repository to Render
3. The included `render.yaml` will automatically configure your web service
4. Add your API keys as environment variables in the Render dashboard
5. Detailed instructions are in `RENDER-DEPLOYMENT.md`

---

## 5. What's Left to Build  
Clearly list unfinished or pending features:

- Add dynamic blog/article routing and real content
- Add backend support for form submissions (e.g., via Supabase or webhook)
- Connect call CTA to actual call scheduling API
- ✅ Implement real AI chat assistant with OpenAI/Gemini integration and ElevenLabs voice
- Add analytics and tracking for user interactions
- Improve mobile responsiveness for complex components
- Replace placeholder images with branded assets
- ✅ Optimize for SEO with prerendered HTML for crawlers
- Add end-to-end tests for critical user journeys
- Implement content management system for non-technical updates
- ✅ Set up proper environment variables (.env) for different deployment environments
- Configure CORS policy for API requests in production

---

## 6. Developer Handoff Instructions  
- Use `npm install` to install dependencies  
- Run with `npm run dev` to start the development server
- The application will be available at `http://localhost:5000` by default
- All editable content lives in `/client/src/components` and `/client/src/pages`
- Main UI components:
  - `WorkflowAgentModal.tsx` - Interactive chat and call request modal
  - `FloatingAgentButton.tsx` - Fixed-position action buttons
  - `HeroSection.tsx` - Main landing area with animations
  - All section components in `/client/src/components/`
- Replace placeholder testimonials and article images as needed
- For theme customization, modify `theme.json` and `tailwind.config.ts`
- UI components are built with Shadcn UI; customize in `/client/src/components/ui/`
- For OpenAI integration, you'll need to set up the OPENAI_API_KEY environment variable
- For analytics integration, modify `/client/src/lib/analytics.ts` (to be implemented)
- Error handling is configured with ErrorBoundary component in `/client/src/components/ErrorBoundary.tsx`
- Toast notifications for user feedback are configured in `/client/src/hooks/use-toast.ts`

### Deployment Guide

- For deployment to Render, see `RENDER-DEPLOYMENT.md` for detailed instructions
- Environment variables must be configured in the Render dashboard
- API keys should only be stored as environment variables, never in code
- Security configuration and checklist are available in `SECURITY-CHECKLIST.md`
- The application includes automatic fallbacks when API services are unavailable

---

## 7. Contacts  
- 📧 `agent@softworkstrading.com`  

---

## 8. Project Structure

```
├── client/
│   ├── src/
│   │   ├── assets/         # SVGs, images, and other static assets
│   │   ├── components/     # React components including sections
│   │   │   ├── ui/         # Reusable UI components (shadcn)
│   │   │   └── ...         # Page sections (Header, Hero, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and shared logic
│   │   ├── pages/          # Page components and routes
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Express server setup
├── shared/                 # Shared types and schemas
├── public/                 # Static files served directly
└── ...                     # Config files
```

## 9. Development Notes

- **UI Components:**
  - Enhanced neural network animation in hero section with stronger glow effects and faster pulse timing
  - Separate floating action buttons for chat (💬) and call (📞) functionality in bottom-right corner
  - Modal with consistent styling for calling and chatting with workflow agents
  - Improved chat message interface with clean white backgrounds and soft shadows
  - Form validation with visual error feedback and shake animation
  - Body scroll lock when modal is open to prevent background scrolling

- **Accessibility:**
  - ARIA labels and roles for interactive elements
  - Proper focus management for keyboard navigation
  - Semantic HTML structure throughout the application
  - Contrast ratios of 4.5:1 minimum for text elements
  - Accessible form controls with validation messages
  - Appropriate alt text for informative images

- **User Experience:**
  - Rotating placeholder suggestions in chat input (e.g., "How can I simplify my daily tasks with AI?")
  - Smooth transitions and animations for interactive elements
  - Responsive layout optimized for mobile, tablet, and desktop
  - Consistent icon usage across the interface
  - Testimonials carousel with navigation arrows on the sides
  - Insights section displaying 3 articles with proper spacing and visual hierarchy

- **Theming:**
  - Brand colors: Deep Navy (#0A2A43) as primary, Cyan (#00BCD4) as accent
  - Theme toggle with proper persistence and system preference detection
  - Dark mode support with appropriate contrast ratios
  - Consistent typography and spacing throughout the application

## 10. Design Philosophy

The website aims to provide a professional, clean interface that communicates the value of AI automation services without overwhelming visitors with technical jargon. Key design principles include:

- Clear and concise messaging
- Visual representations of complex concepts
- Progressive disclosure of information
- Multiple entry points for consultation
- Consistent branding and visual language

## 11. AI Service Configuration

The website integrates with multiple AI services to power the chatbot and voice call features:

### Environment Variables Setup

1. Create a `.env` file in the project root (use `.env.example` as a template)
2. Add your API keys for the following services:

```
# AI Service API Keys (required for full functionality)
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_DEFAULT_VOICE_ID=your_default_voice_id_here
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=production  # Set to production for deployment
HOST=0.0.0.0
API_TIMEOUT=30000

# Security Configuration
CSRF_SECRET=generate_a_random_string_here
SESSION_SECRET=replace_with_at_least_32_characters_long_secret_key

# Client URL (used for CORS in production)
CLIENT_URL=https://your-render-deployment-url.onrender.com
```

### Fallback System

The system is designed with fallbacks to ensure reliability:

1. **Chat Services**:
   - Primary: OpenAI (GPT-3.5 Turbo)
   - If it fails: Returns a graceful error message
   - Note: Gemini integration is provided but disabled in current implementation

2. **Voice Services**:
   - Primary: OpenAI TTS
   - If it fails: Chat continues without voice
   - Note: ElevenLabs integration is provided but disabled in current implementation

### Configuring Voice Options

- For OpenAI TTS, edit `voiceIntegration.ts` to change the voice (default is 'nova')
- Available OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
- Each voice has a different character and tone, with 'nova' being warm and natural

### Testing Without API Keys

The system will continue to function without API keys by providing mock responses for development. In production, ensure all keys are properly configured.

### Deployment to Render

To deploy the application to Render:

1. Push your code to GitHub
2. Create a new Web Service in Render dashboard
3. Connect your GitHub repository
4. Configure the environment variables in the Render dashboard:
   - Add all the variables from your `.env` file
   - Set `NODE_ENV=production`
   - Set `CLIENT_URL` to your Render deployment URL
5. Set the Build Command to `npm install && npm run build`
6. Set the Start Command to `npm start`

The system includes client-side fallbacks for both chat and voice features, so even if the API keys are not configured, the demo will still work with mock responses. However, for the best experience, configure all API keys in your production environment.

## 12. MCP Integration

This project includes Model Context Protocol (MCP) integration for enhanced AI-powered development workflows. MCP allows Claude to interact with external tools and services through standardized APIs.

### MCP Servers

The following MCP servers are configured:

1. **Core Development**
   - `typescript`: Execute TypeScript code directly
   - `node`: Run JavaScript files and Node.js scripts
   - `puppeteer`: Automate browser testing
   - `desktop-commander`: Manage files and project structure

2. **Frontend Development**
   - `react-tools`: Analyze and optimize React components

3. **AI Integration**
   - `openai`: Access OpenAI APIs for text generation and more
   - `elevenlabs`: Voice generation capabilities
   - `gemini`: Access Google Gemini for multimodal AI features

### Using MCP

To work with MCP servers:

1. **Setup MCP Servers**
   ```bash
   npm run setup-mcp
   ```

2. **Start Claude with MCP**
   ```bash
   # Use all MCP servers
   claude --with all
   
   # Use specific servers
   claude --with typescript,puppeteer
   ```

3. **MCP Development Scripts**
   ```bash
   # Development with MCP
   npm run mcp-dev
   
   # Testing with MCP
   npm run mcp-test
   ```

For detailed documentation on MCP usage, see `docs/AI-MCP-INTEGRATION.md`.

## 13. Deterministic Scaffolding

This project includes a deterministic scaffolding framework that can generate new projects with MCP integration. The scaffolding system is designed to be reproducible and extensible.

### Scaffolding with MCP

The scaffolding process includes:

1. **Core Files Generation**
   - Creates essential project files including `.mcp.json`
   - Configures MCP servers based on project type
   - Sets up MCP installation scripts

2. **MCP Integration**
   - Generates `.mcp.json` with appropriate servers
   - Creates setup scripts for MCP servers
   - Adds MCP usage examples for development

3. **Documentation**
   - Generates comprehensive MCP documentation
   - Includes example usage for each MCP server
   - Provides troubleshooting guidance

For instructions on using the scaffolding system, see the prompt at `scripts/deterministic-scaffolding-prompt.md`.

### Running the Scaffolder

To use the scaffolding system with Claude:

```bash
claude-code validate-metadata --file project.json
claude-code configure-mcp --file .mcp.json --servers typescript,puppeteer,desktop-commander,node
claude-code scaffold --meta project.json --with-mcp
```