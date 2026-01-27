# Now Hiring - Job Portal & Widget

A premium, glassmorphism-styled standalone job portal that can also be embedded as a floating widget on ANY website.

---

## 🚀 How to Embed on Any Website

You can add the "Apply Now" portal to any existing website. The widget starts with a "We're Hiring" landing card and then proceeds to the full application form.

### 1. Pure HTML / Standard Websites
Add this single line before your closing `</body>` tag:

```html
<script src="https://now-hiring-eta.vercel.app/widget.js"></script>
```

### 2. Next.js (App Router)
Add the `Script` component to your `app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Script src="https://now-hiring-eta.vercel.app/widget.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
```

### 3. React (Vite / CRA)
Add the script to your `index.html` file before the `</body>` tag:

```html
<script src="https://now-hiring-eta.vercel.app/widget.js"></script>
```

---

## ✨ Features
- **Smart Widget Flow**: 
  - On load, users see a sleek **"We Are Hiring!"** landing card.
  - Clicking "Apply Now" opens the full multi-section form.
  - After closing the modal, the widget stays in the footer as a **minimal icon** (no text).
- **Comprehensive Data**: 
  - Dynamic US State/City dropdowns.
  - Employment Eligibility & Social Security fields.
  - Nested Employment History & References.
  - **Resume & Photo Uploads**.
- **Management**: 
  - Applications saved to PostgreSQL.
  - Detailed HTML email reports sent via Resend.
  - Automated "Source Tracking" (know exactly which site the applicant used).

---

## ⚙️ Local Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`: PostgreSQL string.
   - `RESEND_API_KEY`: API key from [Resend](https://resend.com).

3. **Run Development**
   ```bash
   pnpm dev
   ```

---

## 🏗️ Deployment
Optimized for **Vercel**. 

1. Deploy the repo to Vercel.
2. The widget will be available at `your-app-url.com/widget.js`.
3. Check the provided deployment at: `https://now-hiring-eta.vercel.app`
