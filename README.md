# Now Hiring - Job Portal & Widget

A premium, glassmorphism-styled standalone job portal that can also be embedded as a floating widget on ANY website.

---

## 🚀 How to Embed on Any Website

You can add the "Apply Now" portal to any existing website by adding a single line of JavaScript. This will create a floating "Apply Now" button at the bottom-right of your site.

### Step 1: Add the Script Tag
Include the following script tag just before the closing `</body>` tag on your website:

```html
<script src="https://now-hiring-eta.vercel.app/widget.js"></script>
```
*Note: This script works instantly for any external website.*

### Step 2: How it Works
1.  **Floating Button**: The script automatically injects a purple "Apply Now" button onto your page.
2.  **Iframe Modal**: Clicking the button opens a sleek, glassmorphism modal containing the full job application form.
3.  **Source Tracking**: The application automatically tracks which website the applicant came from (e.g., your-client-site.com).
4.  **Automatic Close**: The modal can be closed via the "X" button, returning the user to your background site instantly.

---

## 🛠️ Features
- **Standalone Mode**: Use it as a full landing page (e.g., `https://your-domain.com`).
- **Real-Time Data**: Dynamic US State and City dropdowns (automatically loads cities based on selected state).
- **Comprehensive Form**: 50+ fields including:
  - Personal Info & Photo Upload
  - Employment Eligibility & Social Security
  - Detailed Employment History (Nested)
  - Professional References
  - Educational Background
- **Notifications**: Automatic email reports sent to your team via Resend.
- **Persistence**: Data saved to a PostgreSQL database.

---

## ⚙️ Local Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` and fill in your details:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `RESEND_API_KEY`: Your API key from [Resend](https://resend.com).

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

---

## 🏗️ Deployment
This project is built with **Next.js 16** and is optimized for **Vercel**.

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your Environment Variables in the Vercel dashboard.
4. The `widget.js` script will be available at `https://your-app-name.vercel.app/widget.js`.

---

## 📂 Project Structure
- `/app/page.tsx`: Standalone landing page.
- `/app/embed/page.tsx`: Optimized view for the iframe widget.
- `/public/widget.js`: The embeddable script for external sites.
- `/components/JobApplicationForm.tsx`: Heart of the application (Shared).
- `/app/api/apply/route.ts`: Backend handler for submissions.
