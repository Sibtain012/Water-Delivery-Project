import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+92 334 6977744',
      subtext: 'Mon-Fri 8AM-8PM, Sat-Sun 9AM-5PM',
      link: 'tel:+923346977744'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'aabetahura@gmail.com',
      subtext: 'We reply within 24 hours',
      link: 'mailto:aabetahura@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: 'Rawalpindi & Islamabad',
      subtext: 'Click to view location',
      link: 'https://www.google.com/maps?ll=33.687527,73.224985&z=16&t=m&hl=en&gl=US&mapclient=embed&cid=16322839347137715683'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Friday: 8AM - 8PM',
      subtext: 'Saturday - Sunday: 9AM - 5PM'
    }
  ];

  const subjects = [
    'General Inquiry',
    'New Order',
    'Existing Order',
    'Billing Question',
    'Technical Support',
    'Feedback',
    'Other'
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-4 sm:mb-6">
              Contact <span className="text-secondary">Aabetahura</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-text/70 max-w-3xl mx-auto px-4">
              Have questions about our water delivery service? We're here to help.
              Reach out to us anytime and we'll get back to you quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 sm:mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text/70 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text/70 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text/70 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text/70 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text/70 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 sm:mb-8">Get in Touch</h2>
              <div className="space-y-6 sm:space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-text mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith('http') ? '_blank' : '_self'}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-text font-medium hover:text-primary transition-colors cursor-pointer text-sm sm:text-base break-words"
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-text font-medium text-sm sm:text-base">{info.details}</p>
                      )}
                      <p className="text-text/70 text-xs sm:text-sm">{info.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-primary/10 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-text mb-2">Emergency Support</h3>
                <p className="text-text/70 mb-4 text-sm sm:text-base">
                  Need immediate assistance with your water delivery? Our emergency support team is available 24/7.
                </p>
                <a
                  href="tel:+923346977744"
                  className="text-primary hover:text-primary/80 font-semibold text-sm sm:text-base"
                >
                  +92 334 6977744
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-text/70 px-4">
              Quick answers to common questions about our service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                  What areas do you deliver to?
                </h3>
                <p className="text-text/70 text-sm sm:text-base">
                  We deliver exclusively to Rawalpindi and Islamabad. Please check our products page or contact us to confirm delivery within these cities.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                  How do I schedule a delivery?
                </h3>
                <p className="text-text/70 text-sm sm:text-base">
                  You can schedule deliveries through our website when placing an order, or by calling our customer service team. We offer flexible scheduling options.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                  What is your bottle exchange program?
                </h3>
                <p className="text-text/70 text-sm sm:text-base">
                  Our bottle exchange program allows you to return empty bottles when receiving new ones, eliminating deposit fees and helping the environment.
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                  Can I modify my subscription?
                </h3>
                <p className="text-text/70 text-sm sm:text-base">
                  Yes! You can modify your subscription frequency, quantities, or pause deliveries at any time through your account or by contacting us.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-text/70 text-sm sm:text-base">
                  We accept cash on delivery, EasyPaisa mobile payments, and will soon support all major credit cards and debit cards with convenient automatic billing for subscription customers.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                  Is same-day delivery available?
                </h3>
                <p className="text-text/70 text-sm sm:text-base">
                  Same-day delivery is available in select areas for orders placed before 2 PM. Additional fees may apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;