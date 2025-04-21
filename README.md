# 🧾 Softworks Trading Company – Project Overview

## 1. Project Purpose  
This is a responsive AI consulting website built for SMEs and solo entrepreneurs to explore AI adoption. The goal is to simplify how users engage with AI automation through agentic workflows, consultations, and education.

---

## 2. Core Features Implemented  
- Hero section with headline, subtext, and dual CTAs (consultation + chat)
- Services section: 3 service cards (AI Setup, Coaching, Strategy Session)
- Step-by-step explainer section: "Easy Steps to Start Automating"
- "Talk to a Workflow Expert" modal with both chat and voice triggers
- Testimonial carousel (3 rotating quotes with image and name)
- Insights & Publications: 2 prominent article cards with larger layout for better readability
- Responsive layout for mobile and desktop
- Light/dark mode toggle with color contrast handling
- Scroll-activated floating CTA
- Footer with Quick Links, Contact Info, and Social Icons

---

## 3. Current Dependencies  
List of key packages and tools installed:

- `react`, `vite` – Frontend framework
- `tailwindcss`, `shadcn/ui` – UI styling and components
- `react-icons`, `lucide-react` – Iconography
- `wouter` – Routing
- `@tanstack/react-query` – Data fetching and state management
- `zod` – Schema validation
- `framer-motion` – Animation library
- `react-hook-form` – Form handling

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
- Connect voice CTA to actual call scheduling
- Improve chatbot UI and link to real AI assistant
- Accessibility audit and mobile optimization pass
- Replace placeholder images with branded assets
- Optimize for SEO and metadata sharing

---

## 6. Developer Handoff Instructions  
- Use `npm install` to install dependencies  
- Run with `npm run dev`  
- All editable content lives in `/client/src/components` and `/client/src/pages`
- Replace placeholder testimonials and article images  
- For dark mode issues, see `tailwind.config.ts` and `theme.json` to ensure proper color contrast
- Update contact details in `Footer.tsx`
- Modify hero section neural network animation in `client/src/assets/neural-background-prominent.svg`

---

## 7. Contacts  
- 📧 `workflow@softworkstrading.com`  
- 📍 301 SW 1st Avenue, Fort Lauderdale, FL 33301  
- ☎️ (971) 238-3860  

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

- The site uses a custom-made neural network animation SVG in the hero section
- Navigation links scroll smoothly to the appropriate sections
- The color scheme follows brand styling with Deep Navy (#0A2A43) as primary and Cyan (#00BCD4) as accent
- All components support both light and dark modes with proper contrast
- The "Talk to a Workflow Expert" modal can be accessed from multiple entry points
- Insights section displays only 2 articles in preview (out of all available articles) with increased spacing and larger card size for better readability, with the rest shown on the dedicated insights page
- Service section CTA buttons use consistent styling across the site
- Services display with actual images from Unsplash instead of icons for more visual impact
- Insights cards feature relevant article images for better visual appeal

## 10. Design Philosophy

The website aims to provide a professional, clean interface that communicates the value of AI automation services without overwhelming visitors with technical jargon. Key design principles include:

- Clear and concise messaging
- Visual representations of complex concepts
- Progressive disclosure of information
- Multiple entry points for consultation
- Consistent branding and visual language