# 🧾 Softworks Trading Company – Project Overview

## 1. Project Purpose  
A sophisticated React-based landing page for Softworks, delivering an AI workflow automation platform with advanced interaction design and user-centric modal experiences. The website serves SMEs and solo entrepreneurs exploring AI adoption, simplifying how users engage with AI automation through agentic workflows, consultations, and education.

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
- **Netlify** – Hosting and deployment  
- **Supabase** – Auth and potential backend  
- **TidyCal (or Google Calendar Embed)** – Scheduling  
- **Plausible** – (Optional) lightweight analytics  

---

## 5. What's Left to Build  
Clearly list unfinished or pending features:

- Add dynamic blog/article routing and real content
- Add backend support for form submissions (e.g., via Supabase or webhook)
- Connect call CTA to actual call scheduling API
- Implement real AI chat assistant with OpenAI integration 
- Add analytics and tracking for user interactions
- Improve mobile responsiveness for complex components
- Replace placeholder images with branded assets
- Optimize for SEO with proper metadata and structured data
- Add end-to-end tests for critical user journeys
- Implement content management system for non-technical updates
- Set up proper environment variables (.env) for different deployment environments
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