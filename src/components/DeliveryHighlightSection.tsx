import React from 'react';
import { motion } from 'framer-motion';
import DeliveryGuyImage from '../../assets/images/service1-4.png';
import BackgroundPattern from '../../assets/images/icons/pattern-3.png';
import { CheckCircle } from 'lucide-react';

const DeliveryHighlightSection: React.FC = () => {
    return (
        <section
            className="bg-background relative w-full text-text overflow-hidden"
            style={{
                backgroundImage: `url(${BackgroundPattern})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
                {/* Mobile Image - Above content on mobile */}
                <motion.div
                    className="flex justify-center mb-8 lg:hidden"
                    initial={{ y: -50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="w-64 h-64 sm:w-72 sm:h-72 bg-white rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={DeliveryGuyImage}
                            alt="Delivery Representative with Water Bottle"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

                {/* Desktop Layout Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Desktop Image - Hidden on mobile */}
                    <motion.div
                        className="relative justify-center lg:justify-start hidden lg:flex"
                        initial={{ x: -150, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <div
                            className="w-[450px] h-[380px] xl:w-[500px] xl:h-[420px] bg-white overflow-hidden shadow-2xl"
                            style={{
                                borderRadius: '65% / 55%',
                                transform: 'rotate(-10deg)',
                            }}
                        >
                            <img
                                src={DeliveryGuyImage}
                                alt="Delivery Representative with Water Bottle"
                                className="w-full h-full object-cover"
                                style={{ transform: 'rotate(10deg) scale(1.2)' }}
                            />
                        </div>
                    </motion.div>                    {/* Content with animation */}
                    <motion.div
                        className="text-text lg:pl-8 xl:pl-12 text-center lg:text-left"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold leading-tight mb-4 sm:mb-6">
                            Cashless Delivery: Modern, Secure, and
                            <span className="text-secondary"> Effortless</span> for You
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-text/80 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            We currently deliver exclusively to <strong className="text-secondary">Islamabad and Rawalpindi</strong>, ensuring fast and reliable service in both cities.
                        </p>

                        <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0">
                            <li className="flex items-start gap-3 group">
                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Modern, cash-free payments for a premium experience</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Seamless orders with the Aabetahura Wallet</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Gift and subscribe easily for family and friends</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Faster deliveries with no cash handling</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Secure, transparent, and hassle-free transactions</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                            <button className="bg-secondary hover:bg-accent text-white py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-full text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                                ORDER TODAY!
                            </button>
                            <button className="bg-accent hover:bg-secondary text-white py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-full text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                                FREE ESTIMATE
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
export default DeliveryHighlightSection;