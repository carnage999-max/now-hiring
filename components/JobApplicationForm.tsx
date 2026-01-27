"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { positions } from '@/lib/positions';
import { useSearchParams } from 'next/navigation';
import { State, City } from 'country-state-city';

export default function JobApplicationForm({ iswidget = false }: { iswidget?: boolean }) {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    maidenName: '',
    dob: '',
    email: '',
    phone: '',
    cellPhone: '',
    ssn: '',
    ageIfUnder18: '',
    referredBy: '',
    address: '',
    aptSuite: '',
    city: '',
    state: '',
    zip: '',
    permanentAddress: '',
    addressHowLong: '',
    position: '',
    salaryDesired: '',
    payType: 'Hourly',
    hoursWeekly: '',
    canWorkNights: 'no',
    employmentDesired: 'Full-time',
    whenAvailable: '',
    isUSCitizen: 'yes',
    isWorkAuthorized: 'yes',
    hasFelony: 'no',
    felonyExplanation: '',
    previouslyWorkedHere: 'no',
    previousWorkDates: '',
    currentlyEmployed: 'no',
    mayInquirePresentEmployer: 'no',
    previouslyApplied: 'no',
    previouslyAppliedDate: '',
    drugScreenConsent: 'no',
    certifyTrue: false,
    authorizeInvestigation: false,
    understandFalseInfo: false,
    availability: {
      mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '', noPref: false
    },
    education: {
      highSchool: { name: '', location: '', years: '', degree: '', from: '', to: '', graduated: 'yes' },
      college: { name: '', location: '', years: '', degree: '', from: '', to: '', graduated: 'yes' },
      tradeSchool: { name: '', location: '', years: '', degree: '', from: '', to: '', graduated: 'yes' },
      professional: { name: '', location: '', years: '', degree: '', from: '', to: '', graduated: 'yes' },
    },
    employmentHistory: [
      { employer: '', address: '', city: '', state: '', zip: '', phone: '', position: '', duties: '', supervisor: '', reason: '', dates: '', payRate: '', canContact: 'yes' },
      { employer: '', address: '', city: '', state: '', zip: '', phone: '', position: '', duties: '', supervisor: '', reason: '', dates: '', payRate: '', canContact: 'yes' }
    ],
    references: [
      { name: '', title: '', company: '', phone: '' },
      { name: '', title: '', company: '', phone: '' },
      { name: '', title: '', company: '', phone: '' }
    ],
    message: '',
    source: ''
  });

  const [statesList] = useState(State.getStatesOfCountry('US'));
  const [citiesList, setCitiesList] = useState<any[]>([]);

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
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData(prev => ({
          ...prev,
          [parts[0]]: {
            ...(prev[parts[0] as keyof typeof prev] as any),
            [parts[1]]: type === 'checkbox' ? checked : value
          }
        }));
      } else if (parts.length === 3) {
        // Handle education.college.name etc
        const [p1, p2, p3] = parts;
        setFormData(prev => ({
          ...prev,
          [p1]: {
            ...(prev[p1 as keyof typeof prev] as any),
            [p2]: {
              ...(prev[p1 as keyof typeof prev] as any)[p2],
              [p3]: value
            }
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    if (name === 'state') {
      const stateObj = statesList.find(s => s.name === value);
      if (stateObj) {
        setCitiesList(City.getCitiesOfState('US', stateObj.isoCode));
        setFormData(prev => ({ ...prev, city: '' }));
      } else {
        setCitiesList([]);
        setFormData(prev => ({ ...prev, city: '' }));
      }
    }
  };

  const handleArrayChange = (index: number, section: 'employmentHistory' | 'references', field: string, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      (newArray[index] as any)[field] = value;
      return { ...prev, [section]: newArray };
    });
  };

  const handleAvailabilityChange = (day: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: value
      }
    }));
  };

  const handleEducationChange = (type: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [type]: {
          ...(prev.education[type as keyof typeof prev.education]),
          [field]: value
        }
      }
    }));
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
    if (!formData.certifyTrue) {
      setErrorMsg("Please certify that the information provided is true.");
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const data = new FormData();
      const payload = {
        ...formData,
        availability: JSON.stringify(formData.availability),
        education: JSON.stringify(formData.education),
        employmentHistory: JSON.stringify(formData.employmentHistory),
        references: JSON.stringify(formData.references)
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (typeof value === 'string') data.append(key, value);
        else if (typeof value === 'boolean') data.append(key, value ? 'true' : 'false');
      });
      
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
          onClick={() => setStatus('idle')}
          className="btn-link"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      {/* SECTION: PERSONAL INFO */}
      <div className="form-section">
        <h3 className="section-title">Personal Information</h3>
        
        <div className="form-row-2">
          <div>
            <label className="label">First Name</label>
            <input name="firstName" required className="glass-input" value={formData.firstName} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Last Name</label>
            <input name="lastName" required className="glass-input" value={formData.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row-2">
          <div>
            <label className="label">Middle Name</label>
            <input name="middleName" className="glass-input" value={formData.middleName} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Maiden Name</label>
            <input name="maidenName" className="glass-input" value={formData.maidenName} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row-2">
          <div>
            <label className="label">Date of Birth</label>
            <input type="date" name="dob" className="glass-input" value={formData.dob} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Social Security No.</label>
            <input name="ssn" className="glass-input" placeholder="XXX-XX-XXXX" value={formData.ssn} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row-2">
          <div>
            <label className="label">Email Address</label>
            <input type="email" name="email" required className="glass-input" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Phone Number (Home)</label>
            <input type="tel" name="phone" required className="glass-input" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row-2">
          <div>
            <label className="label">Cell Phone</label>
            <input type="tel" name="cellPhone" className="glass-input" value={formData.cellPhone} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Referred By</label>
            <input name="referredBy" className="glass-input" value={formData.referredBy} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* SECTION: ADDRESS */}
      <div className="form-section">
        <h3 className="section-title">Address</h3>
        <div className="form-row-2">
          <div style={{ flex: 2 }}>
            <label className="label">Street Address</label>
            <input name="address" required className="glass-input" value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Apt/Suite</label>
            <input name="aptSuite" className="glass-input" value={formData.aptSuite} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row-3">
          <div>
            <label className="label">State</label>
            <select name="state" required className="glass-input" value={formData.state} onChange={handleChange}>
              <option value="">Select State...</option>
              {statesList.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">City</label>
            <select name="city" required className="glass-input" value={formData.city} onChange={handleChange} disabled={!formData.state}>
              <option value="">Select City...</option>
              {citiesList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Zip Code</label>
            <input name="zip" required className="glass-input" value={formData.zip} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Permanent Address (if different)</label>
          <input name="permanentAddress" className="glass-input" value={formData.permanentAddress} onChange={handleChange} />
        </div>
        <div className="form-row-2 mt-4">
          <div>
            <label className="label">How long at this address?</label>
            <input name="addressHowLong" className="glass-input" value={formData.addressHowLong} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Age (if under 18)</label>
            <input name="ageIfUnder18" className="glass-input" type="number" value={formData.ageIfUnder18} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* SECTION: ELIGIBILITY */}
      <div className="form-section">
        <h3 className="section-title">Employment Eligibility</h3>
        <div className="form-row-2">
          <div>
            <label className="label">Are you a U.S. Citizen?</label>
            <select name="isUSCitizen" className="glass-input" value={formData.isUSCitizen} onChange={handleChange}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="label">If no, work authorized?</label>
            <select name="isWorkAuthorized" className="glass-input" value={formData.isWorkAuthorized} onChange={handleChange}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div className="form-row-2 mt-4">
          <div>
            <label className="label">Ever worked here before?</label>
            <select name="previouslyWorkedHere" className="glass-input" value={formData.previouslyWorkedHere} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="label">If yes, when?</label>
            <input name="previousWorkDates" className="glass-input" value={formData.previousWorkDates} onChange={handleChange} placeholder="From - To" />
          </div>
        </div>
        <div className="form-row-2 mt-4">
          <div>
            <label className="label">Convicted of a felony?</label>
            <select name="hasFelony" className="glass-input" value={formData.hasFelony} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {formData.hasFelony === 'yes' && (
            <div>
              <label className="label">Please explain felony</label>
              <input name="felonyExplanation" className="glass-input" value={formData.felonyExplanation} onChange={handleChange} />
            </div>
          )}
        </div>
        <div className="mt-4">
          <label className="label">Submit to drug screening test if selected?</label>
          <select name="drugScreenConsent" className="glass-input" value={formData.drugScreenConsent} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      {/* SECTION: POSITION & AVAILABILITY */}
      <div className="form-section">
        <h3 className="section-title">Job & Availability</h3>
        
        <div className="form-row-2">
          <div>
            <label className="label">Position Applying For</label>
            <select name="position" required className="glass-input" value={formData.position} onChange={handleChange}>
              <option value="" disabled>Select...</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-row gap-2">
            <div style={{ flex: 1 }}>
              <label className="label">Desired Pay</label>
              <input name="salaryDesired" className="glass-input" placeholder="$" value={formData.salaryDesired} onChange={handleChange} />
            </div>
            <div style={{ width: 120 }}>
              <label className="label">Type</label>
              <select name="payType" className="glass-input" value={formData.payType} onChange={handleChange}>
                <option value="Hourly">Hourly</option>
                <option value="Salary">Salary</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-row-3">
          <div>
            <label className="label">Hours/Week</label>
            <input name="hoursWeekly" type="number" className="glass-input" value={formData.hoursWeekly} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Can work nights?</label>
            <select name="canWorkNights" className="glass-input" value={formData.canWorkNights} onChange={handleChange}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="label">When available?</label>
            <input type="date" name="whenAvailable" className="glass-input" value={formData.whenAvailable} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row-full">
          <label className="label">Employment Desired</label>
          <div className="radio-group">
            {['Full-time', 'Part-time', 'Seasonal', 'Both'].map(type => (
              <label key={type} className="radio-item">
                <input type="radio" name="employmentDesired" value={type} checked={formData.employmentDesired === type} onChange={handleChange} />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-row-2 mt-4">
          <div>
            <label className="label">Currently employed?</label>
            <select name="currentlyEmployed" className="glass-input" value={formData.currentlyEmployed} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="label">May we contact present employer?</label>
            <select name="mayInquirePresentEmployer" className="glass-input" value={formData.mayInquirePresentEmployer} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        <div className="form-row-2 mt-4">
          <div>
            <label className="label">Applied here before?</label>
            <select name="previouslyApplied" className="glass-input" value={formData.previouslyApplied} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="label">If yes, when?</label>
            <input name="previouslyAppliedDate" className="glass-input" value={formData.previouslyAppliedDate} onChange={handleChange} />
          </div>
        </div>

        <div className="availability-grid">
          <label className="label grid-label">Weekly Availability (Hours)</label>
          <div className="days-row">
            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
              <div key={day} className="day-col">
                <span className="day-abbr">{day.toUpperCase()}</span>
                <input 
                  className="glass-input small-input" 
                  value={formData.availability[day as keyof typeof formData.availability] as string}
                  onChange={(e) => handleAvailabilityChange(day, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION: EDUCATION */}
      <div className="form-section">
        <h3 className="section-title">Education</h3>
        {Object.entries(formData.education).map(([type, data]) => (
          <div key={type} className="edu-block">
            <h4 className="edu-title">{type.replace(/([A-Z])/g, ' $1').toUpperCase()}</h4>
            <div className="form-row-2">
              <input placeholder="School Name" className="glass-input" value={data.name} onChange={(e) => handleEducationChange(type, 'name', e.target.value)} />
              <input placeholder="Location" className="glass-input" value={data.location} onChange={(e) => handleEducationChange(type, 'location', e.target.value)} />
            </div>
            <div className="form-row-2 mt-2">
              <div className="form-row-2">
                <input placeholder="From" className="glass-input" value={data.from} onChange={(e) => handleEducationChange(type, 'from', e.target.value)} />
                <input placeholder="To" className="glass-input" value={data.to} onChange={(e) => handleEducationChange(type, 'to', e.target.value)} />
              </div>
              <div className="form-row-2">
                <div className="flex-center gap-2">
                  <label className="label" style={{ margin: 0, fontSize: 12 }}>Graduated?</label>
                  <select className="glass-input" style={{ padding: '10px' }} value={data.graduated} onChange={(e) => handleEducationChange(type, 'graduated', e.target.value)}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <input placeholder="Degree/Diploma" className="glass-input" value={data.degree} onChange={(e) => handleEducationChange(type, 'degree', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION: EMPLOYMENT HISTORY */}
      <div className="form-section">
        <h3 className="section-title">Employment History (Most recent first)</h3>
        {formData.employmentHistory.map((job, idx) => (
          <div key={idx} className="edu-block">
            <h4 className="edu-title">EMPLOYER #{idx + 1}</h4>
            <div className="form-row-2">
              <input placeholder="Employer Name" className="glass-input" value={job.employer} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'employer', e.target.value)} />
              <input placeholder="Phone" className="glass-input" value={job.phone} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'phone', e.target.value)} />
            </div>
            <div className="mt-2">
              <input placeholder="Address" className="glass-input" value={job.address} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'address', e.target.value)} />
            </div>
            <div className="form-row-2 mt-2">
              <input placeholder="Position Held" className="glass-input" value={job.position} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'position', e.target.value)} />
              <input placeholder="Supervisor" className="glass-input" value={job.supervisor} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'supervisor', e.target.value)} />
            </div>
            <div className="form-row-2 mt-2">
              <input placeholder="Dates Employed" className="glass-input" value={job.dates} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'dates', e.target.value)} />
              <input placeholder="Pay Rate" className="glass-input" value={job.payRate} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'payRate', e.target.value)} />
            </div>
            <div className="mt-2">
              <textarea placeholder="Duties Performed" className="glass-input" style={{ height: 60 }} value={job.duties} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'duties', e.target.value)} />
            </div>
            <div className="form-row-2 mt-2">
              <input placeholder="Reason for leaving" className="glass-input" value={job.reason} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'reason', e.target.value)} />
              <div className="flex-center gap-2">
                <label className="label" style={{ margin: 0 }}>May we contact?</label>
                <select className="glass-input" value={job.canContact} onChange={(e) => handleArrayChange(idx, 'employmentHistory', 'canContact', e.target.value)}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION: REFERENCES */}
      <div className="form-section">
        <h3 className="section-title">References</h3>
        <div className="form-row-3">
          {formData.references.map((ref, idx) => (
            <div key={idx} className="edu-block" style={{ padding: 12 }}>
              <h4 className="edu-title">REFERENCE #{idx + 1}</h4>
              <input placeholder="Full Name" className="glass-input mt-2" value={ref.name} onChange={(e) => handleArrayChange(idx, 'references', 'name', e.target.value)} />
              <input placeholder="Title" className="glass-input mt-2" value={ref.title} onChange={(e) => handleArrayChange(idx, 'references', 'title', e.target.value)} />
              <input placeholder="Company" className="glass-input mt-2" value={ref.company} onChange={(e) => handleArrayChange(idx, 'references', 'company', e.target.value)} />
              <input placeholder="Phone" className="glass-input mt-2" value={ref.phone} onChange={(e) => handleArrayChange(idx, 'references', 'phone', e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: LEGAL */}
      <div className="form-section">
        <h3 className="section-title">Acknowledgement & Authorization</h3>
        <div className="legal-stack">
          <label className="checkbox-item">
            <input type="checkbox" name="certifyTrue" checked={formData.certifyTrue} onChange={handleChange} />
            <span>I certify that all answers given herein are true and complete to the best of my knowledge.</span>
          </label>
          <label className="checkbox-item mt-4">
            <input type="checkbox" name="authorizeInvestigation" checked={formData.authorizeInvestigation} onChange={handleChange} />
            <span>I authorize investigation of all statements contained in this application for employment.</span>
          </label>
          <label className="checkbox-item mt-4">
            <input type="checkbox" name="understandFalseInfo" checked={formData.understandFalseInfo} onChange={handleChange} />
            <span>I understand that false or misleading information given in my application or interview(s) may result in discharge.</span>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Additional Info & Photo</h3>
        <label className="label">Upload Photo</label>
        <div 
          className={`file-upload-zone ${file ? 'file-upload-active' : ''}`}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} className="hidden-input" accept="image/*" onChange={handleFileChange} />
          {file ? (
            <div className="file-preview">
              <span className="file-name">{file.name}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="btn-icon"><X size={16} /></button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <Upload size={24} /><p className="upload-text">Upload Photo</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="label">Any other comments?</label>
          <textarea name="message" className="glass-input textarea-resize" value={formData.message} onChange={handleChange} />
        </div>
      </div>

      {status === 'error' && <div className="error-banner"><AlertCircle size={16} />{errorMsg}</div>}

      <button type="submit" disabled={status === 'loading'} className="btn-primary flex-center">
        {status === 'loading' && <Loader2 size={18} className="spinner" />}
        {status === 'loading' ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
