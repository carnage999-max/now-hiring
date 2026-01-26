# Now Hiring - Job Portal & Widget

A premium, glassmorphism-styled job application portal that works as a standalone site or an embeddable widget.

## Features

- **Standalone Page**: Beautiful landing page for job applications.
- **Embeddable Widget**: Add a single line of script to ANY website to get a "Apply Now" floating button and modal.
- **Backend Integration**: Saves applications to Postgres and sends email notifications with attachments.
- **Dynamic**: Dropdown with 50+ positions, file upload, validations.

## Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` and fill in your Database and SMTP details.
   ```bash
   cp .env.example .env
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

## How to Embed the Widget

To add the "Apply Now" button to any website, simply include the script tag pointing to your deployed URL.

```html
<script src="https://your-domain.com/widget.js"></script>
```

The script automatically detects the domain and loads the application form in a secure iframe modal.

## Deployment

Deploy to Vercel or any Next.js compatible hosting. Ensure you set the Environment Variables in your project settings.

## Project Structure

- `app/page.tsx`: Main standalone landing page.
- `app/embed/page.tsx`: Lightweight page optimized for the iframe widget.
- `public/widget.js`: The magic script that injects the button and modal.
- `components/JobApplicationForm.tsx`: The core form component.
- `app/api/apply/route.ts`: API handler for form submissions.
