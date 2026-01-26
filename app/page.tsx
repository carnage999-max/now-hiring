import JobApplicationForm from '@/components/JobApplicationForm';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="main-container">
       
       <div className="glass-panel content-wrapper">
         {/* Decorative elements */}
         <div className="gradient-line" />
         
         <div className="hero-section">
            <h1 className="hero-title">
              We Are Hiring
            </h1>
            <p className="hero-subtitle">
              Ready to take the next step in your career? Browse our open positions and apply today.
            </p>
         </div>
          
          <Suspense>
             <JobApplicationForm />
          </Suspense>
         
       </div>
       
       <div className="footer-text">
         By submitting your application, you agree to our privacy policy and terms of service. 
         We celebrate diversity and are committed to creating an inclusive environment for all employees.
       </div>
    </main>
  );
}
