# Implementation Plan - Now Hiring Widget & App

## Goal
Create a Next.js application that serves as a job application portal and provides an embeddable widget (script) for other websites to collect job applications via a modal.

## Core Features
1. **Standalone Job Application Page**: A dedicated page for applicants.
2. **Embeddable Widget**: A plain JS script (`widget.js`) that creates a "Apply Now" button/modal on external sites.
3. **Data Collection**: 
   - Position selection (dropdown of ~50 positions).
   - Applicant details.
   - Photo upload.
4. **Backend**:
   - Save data to Postgres.
   - Send email notification upon submission.
5. **Design**:
   - Premium, glassmorphism aesthetics.
   - Responsive and dynamic (animations).

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: CSS Modules (Vanilla CSS) with modern variables.
- **Languages**: TypeScript.
- **Database**: Postgres (using `pg` driver or lightweight ORM).
- **Icons**: Lucide React.
- **Animations**: Framer Motion.
- **Email**: Nodemailer (or just console log for dev proof-of-concept if SMTP not provided).

## Step-by-Step Implementation

### Phase 1: Foundation & Setup
- [x] Initialize Next.js app.
- [x] Install additional dependencies (`framer-motion`, `lucide-react`, `pg`).
- [x] Setup global CSS variables for the premium theme (HSL colors).

### Phase 2: React Components & standalone page
- [x] Create `Button`, `Input`, `Select`, `Modal` components with glassmorphism styles.
- [x] Create the Main Application Form (`JobApplicationForm`).
- [x] Implement the standalone page at `/`.

### Phase 3: The Embeddable Widget
- [x] Create `/app/embed/page.tsx` (The iframe content - stripped down version).
- [x] Create `public/widget.js`:
    - Logic to inject a button or listen for a trigger.
    - Logic to open an iframe pointing to `/embed`.
    - PostMessage communication (optional, for closing modal).

### Phase 4: Backend & API
- [x] Create Postgres table schema (SQL script).
- [x] Create API route `/api/apply` to handle form submission (text + file).
- [x] Implement Email sending logic.

### Phase 5: Polish
- [x] Add animations.
- [x] Ensure mobile responsiveness.
- [x] Test widget script locally.
