# Asset Organization Guidelines

This document outlines the recommended structure for organizing assets in the application.

## Directory Structure

```
/assets
  ├── favicon/              # Favicon files for different devices
  │
  ├── images/               # Image files organized by type
  │   ├── articles/         # Blog and article images
  │   ├── favicon/          # Favicon image files
  │   ├── illustrations/    # Illustration and graphic elements
  │   ├── logo/             # Logo variations
  │   └── services/         # Service-related images
  │
  ├── fonts/                # Custom web fonts (if any)
  │
  └── videos/               # Video assets (if any)
```

## Naming Conventions

1. Use kebab-case for all asset filenames (e.g., `hero-image.webp`)
2. Include descriptive names that indicate the asset's purpose
3. Group related assets with similar naming patterns

## Image Best Practices

1. Use modern formats: WebP instead of JPEG/PNG where possible
2. Provide responsive image sizes for different viewports
3. Include width and height attributes to prevent layout shifts
4. Use appropriate compression levels for each image type
5. Implement lazy loading for non-critical images

## Referencing Assets

From components, reference assets using consistent paths:

```jsx
// Component example
<img 
  src="/assets/images/services/service-name.webp" 
  alt="Descriptive alt text"
  width="400"
  height="300"
  loading="lazy"
/>
```

## SVG Best Practices

1. Optimize SVGs to remove unnecessary metadata
2. Use inline SVGs for small, interactive elements
3. Use external SVGs for larger, static illustrations
4. Apply proper ARIA attributes for accessibility

## Logo Guidelines

1. Store logo in multiple formats and sizes
2. Include dark/light mode variations if needed
3. Maintain consistent aspect ratios across sizes