import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AddToCartModal from '../components/AddToCartModal';
import SubscriptionModal from '../components/SubscriptionModal';
// import SubscriptionDropdown from '../components/SubscriptionDropdown';
import { products } from '../data/products';
import { Product } from '../types';
import WaterCompositionSection from '../components/WaterCompositionSection';
import HeroSlider from '../components/HeroSlider';
import DeliveryHighlightSection from '../components/DeliveryHighlightSection';
import FeatureSection from '../components/FeatureSection';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const featuredProducts = products.filter(p => p.featured);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSubscribe = (plan: any) => {
    console.log('Subscribed to plan:', plan);
    setIsSubscriptionModalOpen(false);
    // Show a success message or notification that the subscription was added to cart
    // You could add a toast notification here if desired
  };

  const handleOrderToday = () => {
    // Navigate directly to products page for guest checkout
    navigate('/products');
  };

  const handleSubscribeClick = () => {
    // Open subscription modal for all users (no authentication required)
    setIsSubscriptionModalOpen(true);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen pt-4">
      {/* Hero Section */}
      <HeroSlider onOrderToday={handleOrderToday} onSubscribeClick={handleSubscribeClick} />
      {/* <section className="relative bg-gradient-to-br from-blue-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                Pure Water
                <span className="block text-blue-600">Delivered Fresh</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg">
                Experience the taste of natural spring water delivered directly to your door. 
                Subscribe today and never run out of pure, refreshing hydration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-4 rounded-lg font-semibold text-center transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                <img
                  src="https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Premium Water Bottles"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Available for delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}


      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Abetahura?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're committed to delivering the highest quality water with exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section > */}

      {/* Featured Products */}
      <section className="py-20 bg-background" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-text max-w-2xl mx-auto mb-8">
              Our most popular water solutions for home and office
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleViewAllProducts}
              className="bg-secondary hover:bg-accent text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section >
      {/* Features Section */}
      <FeatureSection />
      {/* Water Composition Section */}
      <WaterCompositionSection />
      {/* Delivery Highlight Section */}
      <DeliveryHighlightSection />

      {/* CTA Section */}
      <section className="py-20 bg-background" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-text mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Aabetahura for their hydration needs
          </p>
          <Link
            to="/products"
            className="bg-secondary hover:bg-accent hover:text-text text-text px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
          >
            <span>Start Your Order</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section >

      {/* Water Quality Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
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
                  alt="Crystal clear premium water quality"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-20 bg-gradient-to-br from-background via-white to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-secondary rounded-full mr-2 animate-pulse"></span>
              Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-6">
              Subscribe & Save Up to
              <span className="text-secondary">20%</span>
            </h2>
            <p className="text-xl text-text/80 max-w-3xl mx-auto mb-8">
              Never run out of pure water again. Choose from our flexible subscription plans
              with free delivery, priority support, and the freedom to cancel anytime.
            </p>
            <p className="text-sm text-text/80 max-w-3xl mx-auto mb-8">
              Our bottled water is defined by a commitment to <strong>purity</strong> and <strong>health</strong>. We maintain a Total Dissolved Solids (TDS) level consistently below 150 ppm for excellent taste and clarity. Every drop is purified using advanced <strong>UV</strong> and <strong>ozonation</strong> processes, and bottled in certified <strong>food-grade containers</strong>—ensuring safety, freshness, and a clean, refreshing experience with every sip.
            </p>

            {/* Quick Subscription Dropdown */}
            {/* <div className="flex justify-center mb-8">
              <div className="text-center">
                <p className="text-sm text-text/70 mb-3">Quick Subscribe:</p>
                <SubscriptionDropdown />
              </div>
            </div> */}

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center text-text">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center text-text">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Cancel Anytime</span>
              </div>
              <div className="flex items-center text-text">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Priority Support</span>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {/* Basic Plan */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-secondary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-2xl mb-4">
                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-3">Basic Plan</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-secondary">PKR 2,999</span>
                    <span className="text-lg text-text/60">/mo</span>
                  </div>
                  <div className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
                    Save 10%
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">8 bottles monthly</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Free delivery</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Cancel anytime</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Family Plan - Most Popular */}
            <div className="group relative bg-gradient-to-br from-white to-accent/5 rounded-2xl p-8 border-2 border-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <span className="bg-gradient-to-r from-accent to-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white">
                  ⭐ Most Popular
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 rounded-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-2xl mb-4">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-3">Family Plan</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-secondary">PKR 4,999</span>
                    <span className="text-lg text-text/60">/mo</span>
                  </div>
                  <div className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold">
                    Save 15%
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-accent/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">12 bottles monthly</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-accent/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Free delivery</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-accent/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Priority support</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-accent/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Cancel anytime</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-3">Premium Plan</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-secondary">PKR 7,999</span>
                    <span className="text-lg text-text/60">/mo</span>
                  </div>
                  <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                    Save 18%
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">20 bottles monthly</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Free priority delivery</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Half bottle security deposit</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Dedicated support</span>
                  </li>
                  <li className="flex items-center text-text/80">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Cancel anytime</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="bg-primary hover:bg-gradient-to-r hover:from-secondary hover:to-accent text-white px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center space-x-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Choose Your Plan</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-text/60 text-sm mt-4">
              All plans include free delivery and can be cancelled anytime
            </p>
          </div>
        </div>
      </section>

      <AddToCartModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default Home;  