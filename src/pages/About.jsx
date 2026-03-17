import { motion } from 'framer-motion';
import { FiAward, FiHeart, FiStar, FiGlobe } from 'react-icons/fi';

const values = [
    { icon: FiAward, title: 'Heritage Craftsmanship', desc: 'Three generations of master artisans preserving ancient techniques while embracing modern design.' },
    { icon: FiHeart, title: 'Ethical Sourcing', desc: 'Every gemstone and metal is responsibly sourced, ensuring sustainability and fair trade practices.' },
    { icon: FiStar, title: 'Certified Quality', desc: 'BIS Hallmarked gold, GIA certified diamonds, and independently verified purity in every piece.' },
    { icon: FiGlobe, title: 'Indian Heritage', desc: 'Celebrating India\'s rich jewellery traditions with designs inspired by our glorious cultural heritage.' },
];

const About = () => {
    return (
        <div className="min-h-screen pt-24 bg-warm-white">
            {/* Hero */}
            <section className="bg-gradient-to-r from-champagne/30 via-warm-white to-champagne/30 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="section-heading">
                            Our <span className="gold-text">Story</span>
                        </h1>
                        <p className="text-gray-500 text-lg leading-relaxed max-w-3xl mx-auto">
                            For over 21 years, Deni Jewellers has been synonymous with exquisite craftsmanship
                            and timeless elegance in Indian jewellery making.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="glass-card overflow-hidden shadow-luxury-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80"
                                    alt="Jewellery Craftsmanship"
                                    className="w-full h-96 object-cover"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-[0.2em] mb-4 block">
                                Since 1985
                            </span>
                            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">
                                A Legacy of <span className="gold-text">Brilliance</span>
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    Founded in the heart of Mumbai's historic jewellery district, Deni Jewellers began
                                    as a small workshop where master craftsman Shri Rajendra Mehta transformed raw
                                    gold into works of art.
                                </p>
                                <p>
                                    Today, we continue that legacy with a perfect blend of traditional Indian
                                    craftsmanship and contemporary design sensibility. Each piece in our collection
                                    is a testament to the dedication of our artisans who pour their hearts into
                                    every intricate detail.
                                </p>
                                <p>
                                    From the delicate filigree of our daily wear to the opulent grandeur of our
                                    bridal collections, every creation carries the Deni promise of purity,
                                    authenticity, and timeless beauty.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gradient-to-r from-champagne/20 via-warm-white to-champagne/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="section-heading">
                            Our <span className="gold-text">Values</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map(({ icon: Icon, title, desc }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-7 text-center hover:shadow-luxury transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="font-serif font-semibold text-lg text-gray-800 mb-2">{title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '40+', label: 'Years of Excellence' },
                            { number: '50K+', label: 'Happy Customers' },
                            { number: '10K+', label: 'Unique Designs' },
                            { number: '100%', label: 'Certified Purity' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <p className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                                    {stat.number}
                                </p>
                                <p className="text-primary-100 text-sm">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
