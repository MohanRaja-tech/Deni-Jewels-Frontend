import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const Contact = () => {
    return (
        <div className="min-h-screen pt-24 bg-warm-white">
            <section className="bg-gradient-to-r from-champagne/30 via-warm-white to-champagne/30 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="section-heading">
                            Get in <span className="gold-text">Touch</span>
                        </h1>
                        <p className="section-subheading">
                            Visit our showroom or reach out to us for personalized assistance
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8">
                            Visit Our Showroom
                        </h2>

                        <div className="space-y-6">
                            {[
                                { icon: FiMapPin, title: 'Address', info: '123 Jewellers Lane, Zaveri Bazaar, Mumbai, Maharashtra 400002, India' },
                                { icon: FiPhone, title: 'Phone', info: '+91 98765 43210 / +91 22 2345 6789' },
                                { icon: FiMail, title: 'Email', info: 'info@lumierejewels.com' },
                                { icon: FiClock, title: 'Hours', info: 'Mon - Sat: 10:00 AM - 8:00 PM | Sun: 11:00 AM - 6:00 PM' },
                            ].map(({ icon: Icon, title, info }) => (
                                <div key={title} className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{info}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map */}
                        <div className="mt-8 glass-card overflow-hidden">
                            <iframe
                                title="Showroom Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.8714!2d72.8311!3d18.9518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU3JzA2LjUiTiA3MsKwNDknNTIuMCJF!5e0!3m2!1sen!2sin!4v1700000000000"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="glass-card p-8 shadow-luxury">
                            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                                Send us a Message
                            </h2>

                            <form className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Your Name" className="input-luxury" />
                                    <input type="email" placeholder="Email" className="input-luxury" />
                                </div>
                                <input type="text" placeholder="Subject" className="input-luxury" />
                                <textarea
                                    rows={5}
                                    placeholder="Your message..."
                                    className="input-luxury resize-none"
                                />
                                <button type="submit" className="btn-primary w-full">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
