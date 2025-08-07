import React from 'react';
import FeatureSection from '../components/FeatureSection';
const About: React.FC = () => {
  const stats = [
    { label: 'Years of Experience', value: '15+' },
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Bottles Delivered', value: '2M+' },
    { label: 'Cities Served', value: '100+' }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6">
              About <span className="text-secondary">Aabetahura</span>
            </h1>
            <p className="text-xl text-text/80 max-w-3xl mx-auto">
              For over 15 years, we've been dedicated to bringing you the purest, most refreshing water
              directly from nature's finest sources to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                  {stat.value}
                </div>
                <div className="text-text/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exchange Policy Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Water Quality Promise
              </h2>
              <div className="space-y-2 text-white text-xs md:text-sm">
                <p>
                  Our bottled water is defined by a commitment to purity and health. We maintain a Total Dissolved Solids (TDS) level consistently below 150 ppm, placing our water in the excellent range for quality and taste. This careful monitoring ensures that every sip you take is free from excessive mineral content, providing a clean and refreshing experience. Furthermore, our water is naturally <strong>anti-scale</strong>, a property that can help reduce the risk of mineral buildup in the body, specifically in the kidneys, thereby contributing to a lower chance of developing kidney stones.
                </p>
                <p>
                  The clarity of our water is a testament to its exceptional quality. We achieve <strong>zero turbidity</strong>, meaning there are no suspended particles to cloud the water. This is not only aesthetically pleasing but also beneficial for your health, as it reduces the workload on your kidneys, allowing them to function more efficiently. To guarantee the highest level of safety, every drop of our water undergoes a rigorous purification process, including exposure to powerful <strong>UV rays</strong> and an <strong>ozonation process</strong>. This dual-action treatment effectively neutralizes harmful bacteria and microorganisms, ensuring that our water is not only clean but also incredibly safe to drink with a very low chance of bacterial growth.
                </p>
                <p>
                  We take the safety of our product a step further by using only <strong>food-grade water bottles</strong>. These bottles are made from materials that are certified safe for contact with consumables and are free from harmful chemicals. This dedication to using high-quality, safe packaging ensures that the purity of our water is preserved from our facility to your doorstep, providing you with a product that is as safe as it is delicious. Our comprehensive quality control from source to packaging ensures that you receive a bottle of water you can trust.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Water bottle exchange and recycling"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FeatureSection />

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Our Values
            </h2>
            <p className="text-xl text-text/70 max-w-2xl mx-auto">
              These core principles guide everything we do and shape how we serve our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quality Value */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Uncompromising Quality</h3>
              <p className="text-text/70 leading-relaxed">
                We source our water from the purest natural springs and employ rigorous quality control measures to ensure every drop meets the highest standards of purity and taste.
              </p>
            </div>

            {/* Reliability Value */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Reliable Service</h3>
              <p className="text-text/70 leading-relaxed">
                Your hydration needs are our priority. We promise consistent, on-time deliveries and responsive customer service that you can count on, every single time.
              </p>
            </div>

            {/* Sustainability Value */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Environmental Care</h3>
              <p className="text-text/70 leading-relaxed">
                We're committed to protecting our planet through sustainable practices, eco-friendly packaging, and responsible bottle exchange programs that minimize environmental impact.
              </p>
            </div>

            {/* Customer Focus Value */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Customer First</h3>
              <p className="text-text/70 leading-relaxed">
                Your satisfaction drives everything we do. We listen to your needs, adapt to your preferences, and continuously improve our services based on your valuable feedback.
              </p>
            </div>

            {/* Innovation Value */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Innovation</h3>
              <p className="text-text/70 leading-relaxed">
                We embrace technology and innovative solutions to enhance your experience, from our user-friendly mobile app to our efficient delivery systems and smart tracking features.
              </p>
            </div>

            {/* Integrity Value */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Integrity & Trust</h3>
              <p className="text-text/70 leading-relaxed">
                We build lasting relationships through honest communication, transparent pricing, and ethical business practices that earn your trust and respect every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-text/70 leading-relaxed">
                <p>
                  Established in 2020 by two visionary brothers in Islamabad, Aabetahura was founded on a simple yet powerful idea: to revolutionize the traditional water delivery service by integrating it with modern technology. We recognized the need for a more convenient and efficient system, and our solution was to pioneer a completely cashless delivery model. To support this innovation, we developed a dedicated customer portal, giving you unprecedented control and transparency. By simply signing in, you can track your bottle deliveries in real-time and manage your *Aabetahura wallet* with ease.
                </p>
                <p>
                  Beyond our technological advancements, our core mission is to provide water of the highest quality. We are committed to health and purity, ensuring our water consistently maintains a TDS (Total Dissolved Solids) level of 150 ppm, a benchmark for excellent drinking water. We believe everyone deserves to know the quality of their water, which is why we proudly offer a complimentary TDS check service for your home. At Aabetahura, we're not just delivering water; we're delivering a commitment to quality, convenience, and peace of mind.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Our story - water delivery journey"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From source to doorstep, we ensure every step maintains the highest standards of quality and purity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Source Selection</h3>
              <p className="text-slate-600">
                We carefully select pristine natural springs and test water sources for purity and mineral content.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Purification</h3>
              <p className="text-slate-600">
                Advanced multi-stage filtration and purification processes ensure optimal taste and safety.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Quality Testing</h3>
              <p className="text-slate-600">
                Rigorous laboratory testing and quality control checks at every stage of production.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">4. Safe Delivery</h3>
              <p className="text-slate-600">
                Secure packaging and temperature-controlled delivery to maintain freshness and quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Aabetahura?
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              We go beyond just delivering water - we deliver peace of mind, convenience, and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Scheduling</h3>
              <p className="text-white/90">
                Choose delivery times that work for your schedule. Change or cancel orders with ease through our mobile app.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
              <p className="text-white/90">
                No hidden fees or surprise charges. Simple, competitive pricing with flexible payment options.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-white/90">
                Our customer service team is available round the clock to assist with orders, questions, or concerns.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
              <p className="text-white/90">
                100% satisfaction guarantee. If you're not completely happy with your water, we'll make it right.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-white/90">
                Same-day and next-day delivery options available. Track your order in real-time with our mobile app.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Eco-Friendly</h3>
              <p className="text-white/90">
                Sustainable packaging and bottle exchange programs that help reduce environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Experience the Aabetahura Difference?
            </h2>
            <p className="text-xl text-primary/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their hydration needs.
              Pure water, reliable service, exceptional value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-secondary text-primary hover:bg-secondary/80 px-8 py-4 rounded-lg font-semibold inline-block transition-colors"
              >
                Start Your Order Today
              </a>
              <a
                href="/contact"
                className="bg-secondary border-2 border-white text-primary hover:bg-secondary/80 hover:text-primary px-8 py-4 rounded-lg font-semibold inline-block transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;