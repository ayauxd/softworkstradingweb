Create a documentation file named `README.md` at the project root.

Include the following sections with clear structure and content:

---

# 🧾 Softworks Trading Company – Project Overview

## 1. Project Purpose  
This is a responsive AI consulting website built for SMEs and solo entrepreneurs to explore AI adoption. The goal is to simplify how users engage with AI automation through agentic workflows, consultations, and education.

---

## 2. Core Features Implemented  
- Hero section with headline, subtext, and dual CTAs (consultation + chat)
- Services section: 3 service cards (AI Setup, Coaching, Strategy Session)
- Step-by-step explainer section: “Easy Steps to Start Automating”
- “Talk to a Workflow Expert” modal with both chat and voice triggers
- Testimonial carousel (3 rotating quotes with image and name)
- Insights & Publications: 3 article cards linking to external pages
- Responsive layout for mobile and desktop
- Light/dark mode toggle with color contrast handling
- Scroll-activated floating CTA
- Footer with Quick Links, Contact Info, and Social Icons

---

## 3. Current Dependencies  
List the packages and tools installed:

- `react`, `vite` – Frontend framework
- `tailwindcss`, `shadcn/ui` – UI styling and components
- `react-icons`, `lucide-react` – Iconography
- `supabase` – Authentication and backend (email auth active)
- `openai`, `@voice` – Voice assistant integration (via OpenAI + ElevenLabs)
- `pnpm` – Package manager

---

## 4. Supporting Tools & Hosting  
- **Replit** – Main development environment  
- **Netlify** – Hosting and deployment  
- **Supabase** – Auth and potential backend  
- **TidyCal (or Google Calendar Embed)** – Scheduling  
- **Plausible** – (Optional) lightweight analytics  

---

## 5. What’s Left to Build  
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
- Use `pnpm install` to install dependencies  
- Run with `pnpm dev`  
- All editable content lives in `/components`, `/pages`, and `/public`  
- Replace placeholder testimonials and article images  
- For dark mode issues, see `tailwind.config.js` and ensure contrast classes are used  
- Update contact details in `Footer.jsx`

---

## 7. Contacts  
- 📧 `workflow@softworkstrading.com`  
- 📍 301 SW 1st Avenue, Fort Lauderdale, FL 33301  
- ☎️ (971) 238-3860  

---

Ensure this file is committed and visible in the repo root.
