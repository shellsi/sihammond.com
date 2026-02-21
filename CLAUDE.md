# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional website (sihammond.com) for Si Hammond, a senior AI contractor. The site serves as a professional branding platform designed to attract contract enquiries from health-tech and edtech decision-makers. The site emphasizes credibility, technical expertise, and real-world AI implementation experience.

## Architecture

- **Static HTML site**: Single-page application with all styles embedded in `index.html`
- **Typography**: Google Fonts (Cormorant Garamond display font, DM Sans body font)
- **Styling**: CSS custom properties with a refined typographic design
- **No build process**: Direct HTML/CSS/JS serving
- **Responsive design**: Mobile-first approach with CSS Grid and Flexbox

### Design System

- **Color palette**: Deep teal (`--teal`), ink blue (`--ink`), amber accent (`--amber`), warm off-white background (`--warm-white`)
- **Typography**: Serif display font for headings, clean sans-serif for body text
- **Layout**: Section-by-section scroll with generous whitespace and asymmetric grid
- **Animations**: Subtle fade-in on scroll, minimal hover effects
- **Navigation**: Fixed nav bar with scroll state detection

### Key Sections

1. **Hero**: Full-viewport intro with name, tagline, and CTAs
2. **Capabilities**: Three-column grid showcasing AI expertise areas
3. **Background**: Two-column layout with narrative and credentials
4. **Sectors**: Focus areas with numbered sections
5. **Work**: Selected portfolio items linking to shellsi.com
6. **Contact**: Dark section with email CTA and LinkedIn link

## Target Audience

- CTOs / Heads of AI at health-tech and edtech startups
- Technical leads at NHS digital suppliers  
- Founders of AI-adjacent companies seeking senior contract partners

## Contact Information

- **Primary CTA**: `si@shellsi.com`
- **Portfolio**: `shellsi.com`
- **LinkedIn**: `linkedin.com/in/simonhammond`

## Development

No build tools or package managers required. The site is entirely self-contained in `index.html` with embedded styles and minimal JavaScript for scroll effects and navigation state.

### Analytics

Google Analytics tracking is configured with ID: `UA-154897229-1`

### Performance

- External dependencies limited to Google Fonts
- Intersection Observer API for scroll-triggered animations
- CSS custom properties for consistent theming
- No heavy JavaScript frameworks or libraries