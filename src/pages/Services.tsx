import React from 'react';
import { Truck, RefreshCw, Clock, Shield, Home, Building2 } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Truck,
      title: 'Water Delivery',
      description: 'Fresh, pure water delivered directly to your door on your schedule.',
      features: ['Same-day delivery available', 'Flexible scheduling', 'Contactless delivery', 'Real-time tracking']
    },
    {
      icon: RefreshCw,
      title: 'Bottle Exchange',
      description: 'Eco-friendly bottle exchange program with no deposit required.',
      features: ['No deposit fees', 'Automatic pickup', 'Sanitized bottles', 'Environmental impact tracking']
    },
    {
      icon: Clock,
      title: 'Subscription Plans',
      description: 'Never run out of water with our flexible subscription options.',
      features: ['15% savings', 'Flexible scheduling', 'Easy modifications', 'Priority delivery']
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control for peace of mind.',
      features: ['Lab-tested purity', 'Source monitoring', 'Quality certificates', '24/7 quality hotline']
    }
  ];

  const solutions = [
    {
      icon: Home,
      title: 'Home Delivery',
      description: 'Perfect for families who want the convenience of pure water at home.',
      benefits: ['Family-sized options', 'Child-safe dispensers', 'Flexible delivery times', 'Emergency delivery']
    },
    {
      icon: Building2,
      title: 'Office Solutions',
      description: 'Keep your workplace hydrated with our business delivery services.',
      benefits: ['Bulk pricing', 'Multiple locations', 'Billing consolidation', 'Account management']
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6">
              Our <span className="text-secondary">Services</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From delivery to dispensers, we provide comprehensive water solutions
              tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-10 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-background border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold text-text mb-4">{service.title}</h3>
              <p className="text-slate-600 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-slate-600">
                    <div className="w-2 h-2 bg-accent  rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-slate-50" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-background rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mr-4">
                    <solution.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-text">{solution.title}</h3>
                </div>
                <p className="text-slate-600 mb-6">{solution.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {solution.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-600">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Process Section */}
      <section className="py-20 bg-background" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Getting started with Abe Tahura is simple and convenient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Choose Your Water</h3>
              <p className="text-slate-600">Select from our premium water options and sizes that fit your needs.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Schedule Delivery</h3>
              <p className="text-slate-600">Pick your delivery date and time that works best for your schedule.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Enjoy Pure Water</h3>
              <p className="text-slate-600">Receive your water delivery and enjoy the pure, refreshing taste.</p>
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      <section className="py-20 bg-primary" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Experience the convenience and quality of Abe Tahura's water delivery service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-background hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              View Products
            </a>
            <a
              href="/contact"
              className="border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section >
    </div >
  );
};

export default Services;