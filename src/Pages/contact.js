import { useState } from "react";
import "../assets/Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.full_name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("✅ Thank you for your message! We'll get back to you soon. 📚");
        // Clear form
        setFormData({
          full_name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">Get In Touch</h1>
        <p className="contact-subtitle">
          Have questions about our books or need recommendations? We'd love to hear from you. 
          Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <div className="contact-info">
          <h3 className="info-title">Contact Information</h3>
          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">📞</div>
              <div className="method-content">
                <h4>Phone</h4>
                <p>+1 (555) 123-4567<br />
                Mon-Fri from 8am to 6pm</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">✉️</div>
              <div className="method-content">
                <h4>Email</h4>
                <p>hello@bookhaven.com<br />
                We reply within 24 hours</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">📍</div>
              <div className="method-content">
                <h4>Visit Our Store</h4>
                <p>123 Book Street<br />
                Literary District, City 10001</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">💬</div>
              <div className="method-content">
                <h4>Live Chat</h4>
                <p>Available 24/7<br />
                Get instant help from our team</p>
              </div>
            </div>
          </div>

          {/* Store Hours */}
          <div className="store-info">
            <div className="store-hours">
              <h4>Store Hours</h4>
              <ul className="hours-list">
                <li><span>Monday - Friday</span> <span>9:00 AM - 8:00 PM</span></li>
                <li><span>Saturday</span> <span>10:00 AM - 6:00 PM</span></li>
                <li><span>Sunday</span> <span>11:00 AM - 5:00 PM</span></li>
                <li><span>Holidays</span> <span>12:00 PM - 4:00 PM</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form">
          <h3 className="form-title">Send us a Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="full_name">Full Name</label>
              <input 
                type="text" 
                id="full_name"
                name="full_name"
                className="form-input" 
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                className="form-input" 
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject"
                name="subject"
                className="form-input" 
                placeholder="What is this regarding?"
                value={formData.subject}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Your Message</label>
              <textarea 
                id="message"
                name="message"
                className="form-textarea" 
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}