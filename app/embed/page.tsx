"use client";

import JobApplicationForm from '@/components/JobApplicationForm';
import { X } from 'lucide-react';
import { Suspense } from 'react';

export default function EmbedPage() {
  const handleClose = () => {
    // Send message to parent window to close the iframe
    window.parent.postMessage('close-widget', '*');
  };

  return (
    <div className="embed-container">
        {/* Close Button positioned absolutely relative to viewport */}
        <button 
          onClick={handleClose}
          className="btn-close"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="glass-panel embed-wrapper">
             <div className="embed-header">
                <div>
                  <h2 className="embed-title">Apply Position</h2>
                  <p className="embed-subtitle">Join our growing team today.</p>
                </div>
             </div>
             <Suspense>
              <JobApplicationForm iswidget />
             </Suspense>
        </div>
    </div>
  )
}
