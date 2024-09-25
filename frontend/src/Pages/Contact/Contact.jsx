import React, { useState, useEffect } from 'react';
import './Contact.css'
import { useAuth0 } from '@auth0/auth0-react';
import { API_URL } from '../../services/api';

const Contact = () => {
  const { isAuthenticated, user } = useAuth0();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Populate username and email if the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setFormData({
        username: user.name || '',
        email: user.email || '',
        message: ''
      });
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('Message sent successfully!');
      } else {
        setSubmitStatus('Error sending message.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('An error occurred while sending the message.');
    } finally {
      setIsSubmitting(false);
      setFormData({
        username: '',
        email: '',
        message: ''
      });
    }
  };

  return (
    <div className='section-padding'>
      <div className="container">
        <div className="section-header text-center">
          <h3 className="section-head">Contact Us</h3>
        </div>
        <div className="contact-form w-50 m-auto">
          {submitStatus && <p className="text-center">{submitStatus}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label cursor-pointer">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="true"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label cursor-pointer">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="true"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label cursor-pointer">Message</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="w-100 text-center mt-5">
              <button type="submit" className="ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
