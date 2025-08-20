import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().max(500, 'Message too long (max 500 characters)').optional(),
});

export default function PackageCard({ pkg }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleEnquire(e) {
    e.preventDefault();
    const parse = enquirySchema.safeParse(form);
    
    if (!parse.success) {
      const fieldErrors = {};
      parse.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      toast.error('Please fix the form errors');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg._id,
          user_name: form.name,
          user_email: form.email,
          message: form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success('Enquiry submitted successfully!');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to submit enquiry');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Enquiry error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
        <div className="text-green-500 text-4xl mb-3">✓</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Enquiry Submitted!</h3>
        <p className="text-green-700 text-sm">
          Thank you for your interest in <strong>{pkg.package_name}</strong>. 
          We'll get back to you soon!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Package Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.package_name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{pkg.clinic_name}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{pkg.treatment.name}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-2xl font-bold text-blue-600">₹{pkg.price.toLocaleString()}</div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                {showForm ? 'Cancel' : 'Enquire Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        {showForm && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Send Enquiry</h4>
            <form onSubmit={handleEnquire} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  className={`w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className={`w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Your message (optional)"
                  rows={3}
                  className={`w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Enquiry'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
