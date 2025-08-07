import React from 'react';
import { motion, Variants } from 'framer-motion';
import GlassImage from '../../assets/images/icons/water-glass-1.png';
import PatternImage from '../../assets/images/icons/pattern-2.png';

const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: (custom: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: custom * 0.25,
            duration: 0.6,
            ease: 'easeOut',
        },
    }),
};

const WaterCompositionSection: React.FC = () => {
    return (
        <section className="bg-background py-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* Heading */}
                <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    custom={0}
                >
                    <h2 className="text-4xl md:text-6xl font-playfair text-text font-normal leading-tight mb-4">
                        <span className="block">ABETAHURA Basic Water</span>
                        <span className="block text-text">Composition</span>
                    </h2>
                    <div className="w-12 h-1 bg-secondary mx-auto rounded-full" />
                </motion.div>

                {/* Main Grid */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                    {/* Left Column */}
                    <div className="flex flex-col gap-16 text-right">
                        {[
                            {
                                title: 'Zero Sodium',
                                value: '0 mg/l',
                                desc: ' We make sure our water has zero sodium to maintain the blood pressure.',
                            },
                            {
                                title: 'Fluoride',
                                value: '0.5 mg/l',
                                desc: '0.5mg fluoride is needed to purify 1 liter of water.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                custom={i + 2}
                            >
                                <h4 className="font-bold text-text">
                                    {item.title}
                                    <br />
                                    <span className="text-lg font-normal">{item.value}</span>
                                </h4>
                                <p className="text-md text-text mt-2">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Center: Glass with background pattern */}
                    <motion.div
                        className="relative flex justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        viewport={{ once: true }}
                    >
                        <div className="relative w-[300px] h-[300px]">
                            {/* Background Pattern */}
                            <div
                                className="absolute inset-0 bg-no-repeat bg-center bg-contain"
                                style={{
                                    backgroundImage: `url(${PatternImage})`,
                                }}
                            />
                            {/* Glass Image */}
                            <img
                                src={GlassImage}
                                alt="Water Glass"
                                className="max-h-80 relative z-10 mx-auto"
                            />
                        </div>

                        <div className="absolute inset-y-0 left-64 right-0 w-full border-l border-dashed border-text hidden md:block" />
                    </motion.div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-16 text-left">
                        {[
                            {
                                title: 'Calcium',
                                value: '350.8 mg/l',
                                desc: 'To purify water give 350.8 mg chlorine for every liter of water…',
                            },
                            {
                                title: 'Magnesium',
                                value: '14.5 mg/l',
                                desc: '14.5mg of magnesium will be required to purify every liter…',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                custom={i + 4}
                            >
                                <h4 className="font-bold text-text">
                                    {item.title}
                                    <br />
                                    <span className="text-lg font-normal">{item.value}</span>
                                </h4>
                                <p className="text-md text-text mt-2">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Composition Row */}
                <motion.div
                    className="mt-16 mr-10 
                    flex justify-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    custom={6}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 gap-6 text-lg text-text font-medium text-center">
                        {[
                            ['Nitrates', '2 mg/l'],
                            ['Bicarbonates', '157 mg/l'],
                            ['Sulphates', '5.6 mg/l'],
                        ].map(([label, value], i) => (
                            <div key={i}>
                                {label}
                                <br />
                                <span className="text-lg font-normal">{value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WaterCompositionSection;
