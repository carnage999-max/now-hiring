"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { positions } from '@/lib/positions';
import { useSearchParams } from 'next/navigation';

export default function JobApplicationForm({ iswidget = false }: { iswidget?: boolean }) {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    source: ''
  });

  useEffect(() => {
    if (iswidget) {
        const source = searchParams.get('source');
        if (source) {
            setFormData(prev => ({ ...prev, source }));
        }
    }
  }, [searchParams, iswidget]);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (file) data.append('photo', file);

      const res = await fetch('/api/apply', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error(await res.text());

      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="success-message-container"
      >
        <div className="success-icon-wrapper">
          <Check size={32} />
        </div>
        <h3 className="success-title">Application Received!</h3>
        <p className="success-text">Thank you for applying. We will review your application and get back to you shortly.</p>
        <button 
          onClick={() => {
            setStatus('idle');
            setFormData(prev => ({ 
              firstName: '', 
              lastName: '', 
              email: '', 
              phone: '', 
              position: '', 
              message: '',
              source: prev.source // Keep the source for the next application
            }));
            setFile(null);
          }}
          className="btn-link"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="form-row-2">
        <div>
          <label className="label">First Name</label>
          <input 
            type="text" 
            name="firstName" 
            required
            className="glass-input" 
            placeholder="Jane"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Last Name</label>
          <input 
            type="text" 
            name="lastName" 
            required
            className="glass-input" 
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row-2">
        <div>
          <label className="label">Email Address</label>
          <input 
            type="email" 
            name="email" 
            required
            className="glass-input" 
            placeholder="jane@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input 
            type="tel" 
            name="phone" 
            required
            className="glass-input" 
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="label">Position Applying For</label>
        <select 
          name="position" 
          required
          className="glass-input" 
          value={formData.position}
          onChange={handleChange}
        >
          <option value="" disabled className="option-default">Select a position...</option>
          {positions.map(pos => (
            <option key={pos} value={pos} className="option-item">{pos}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Upload Photo</label>
        <div 
          className={`file-upload-zone ${file ? 'file-upload-active' : ''}`}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden-input" 
            accept="image/*"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="file-preview">
              <span className="file-name">{file.name}</span>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <Upload size={24} />
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-subtext">JPG, PNG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="label">About You / Message</label>
        <textarea 
          name="message" 
          className="glass-input textarea-resize" 
          placeholder="Tell us a bit about yourself..."
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      {status === 'error' && (
        <div className="error-banner">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="btn-primary flex-center"
      >
        {status === 'loading' && <Loader2 size={18} className="spinner" />}
        {status === 'loading' ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
