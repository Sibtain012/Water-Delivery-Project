import React from 'react';
import { FaTint, FaCertificate, FaFilter, FaBan } from 'react-icons/fa';

const FeatureSection: React.FC = () => {
    return (
        < section className="w-full bg-background py-20" >
            <div className="max-w-6xl mx-auto px-4 text-center ">
                {/* Heading */}
                <h2 className="text-5xl font-normal md:text-5xl font-playfair text-text mb-4">
                    A Trusted Name In <br />
                    <span className="block mt-4 text-5xl font-normal">
                        Mineral Water Industry
                    </span>
                </h2>


                {/* Separator */}
                <div className="flex justify-center mb-12">
                    <div className="w-10 h-1 bg-secondary rounded-full" />
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Feature 1 */}
                    <div>
                        <div className="flex justify-center">
                            <FaTint className="flaticon-drop-leaf-table text-secondary text-5xl mb-4 block" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-2">Maximum Purity</h3>
                        <p className="text-sm text-text mb-4">
                            Due to the importance of water in our life we give 99.99% pure water to our customers.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div>
                        <div className="flex justify-center">
                            <FaFilter className="flaticon-water text-secondary text-5xl mb-4 block" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-2">5 Steps Filtration</h3>
                        <p className="text-sm text-text mb-4">
                            Water has different types of impurity. 5 steps filtration removes all the impurity of the water.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div>
                        <div className="flex justify-center">
                            <FaBan className="text-secondary text-5xl mb-4" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-2">Chlorine Free</h3>
                        <p className="text-sm text-text mb-4">
                            We serve our water chlorine free to think about clients’ lives since chlorine causes serious damage to our health.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div>
                        <div className="flex justify-center">
                            <FaCertificate className="flaticon-water-barrel text-secondary text-5xl mb-4 block" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-2">Quality Certified</h3>
                        <p className="text-sm text-text mb-4">
                            Our water quality is certified in several countries (BD, USA, UK, UAE) due to the purity of the water.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
