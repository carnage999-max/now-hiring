# Now Hiring - Job Portal & Widget

A premium, glassmorphism-styled standalone job portal that can also be embedded as a floating widget on ANY website.

---

## 🚀 How to Embed on Any Website

You can add the "Apply Now" portal to any existing website. The widget starts with a "We're Hiring" landing card and then proceeds to the full application form.

### 1. Pure HTML / Standard Websites
Add this single line before your closing `</body>` tag. You can customize the button text using the `name` attribute and the icon using the `icon` attribute (supports any [Lucide React](https://lucide.dev/icons) icon name). You can also add an emoji using the `emoji` attribute:

```html
<!-- Default: "Now Hiring" with Briefcase icon -->
<script src="https://now-hiring-eta.vercel.app/widget.js"></script>

<!-- Custom text and icon (e.g., Scissors for a barbershop, ChefHat for a restaurant) -->
<script name="Now Hiring Stylists" icon="Scissors" src="https://now-hiring-eta.vercel.app/widget.js"></script>

<!-- Custom text with an emoji and no icon -->
<script name="Launch Your Career" emoji="🚀" src="https://now-hiring-eta.vercel.app/widget.js"></script>
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
        {/* Custom button text, icon, and/or emoji via data-* attributes */}
        <Script 
          data-name="Now Hiring Chefs" 
          data-icon="ChefHat"
          data-emoji="🧑‍🍳"
          src="https://now-hiring-eta.vercel.app/widget.js" 
          strategy="afterInteractive" 
        />
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

### 4. Custom Button & Global API
If you want to use your own custom-styled button (e.g., a **Taco** styled button for a Mexican restaurant), you can disable the default button and trigger the widget manually.

#### Option A: Selector Trigger (Auto-bind)
Add `data-manual="true"` to disable the default button and `data-trigger=".your-selector"` to automatically bind the widget to your custom element when it's clicked.

```html
<!-- Your custom taco button -->
<button class="taco-btn">🌮 Apply Now</button>

<!-- Widget with manual mode and selector -->
<script 
  data-manual="true" 
  data-trigger=".taco-btn" 
  src="https://now-hiring-eta.vercel.app/widget.js">
</script>
```

#### Option B: Global API (Direct Control)
You can call the widget API from any JavaScript component (React, Vue, etc.) after the script has loaded.

```javascript
// Open the hiring form
HiringWidget.open();

// Close the hiring form
HiringWidget.close();
```

Example in a React component:
```tsx
const TacoButton = () => (
  <button onClick={() => (window as any).HiringWidget.open()}>
    🌮 Join our Mexican Restaurant Team
  </button>
);
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
