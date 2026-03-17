import { Link } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-pearl to-champagne/30 border-t border-primary-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex flex-col items-start leading-none mb-6">
                            <h3 className="text-2xl font-serif font-extrabold tracking-tight gold-text">DENI</h3>
                            <p className="text-[9px] tracking-[0.4em] text-primary-500 font-bold uppercase ml-0.5">Jewellers</p>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Crafting timeless elegance since 1985. Each piece tells a story of artistry,
                            heritage, and unparalleled luxury.
                        </p>
                        <div className="flex gap-3">
                            {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/80 border border-primary-100/50
                  flex items-center justify-center text-primary-500 hover:bg-primary-500
                  hover:text-white transition-all duration-300 shadow-soft">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-6">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {['Home', 'Collections', 'About Us', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item === 'Home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-500 hover:text-primary-600 text-sm transition-colors
                      flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-300
                      group-hover:bg-primary-500 transition-colors" />
                                        {item === 'About Us' ? 'About' : item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-6">
                            Categories
                        </h4>
                        <ul className="space-y-3">
                            {['Rings', 'Necklaces', 'Bangles', 'Earrings', 'Bridal'].map((cat) => (
                                <li key={cat}>
                                    <Link to={`/collections?category=${cat}`}
                                        className="text-gray-500 hover:text-primary-600 text-sm transition-colors
                      flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-300
                      group-hover:bg-primary-500 transition-colors" />
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-6">
                            Visit Us
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-500">
                                <FiMapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span>Roundana junction,Main Road,Thingal Nagar-629802</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-500">
                                <FiPhone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span>+91 9443344513</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-500">
                                <FiMail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span>denijewellers@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-primary-100/50 flex flex-col md:flex-row
          items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Deni Jewellers. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        Crafted with <span className="text-primary-500">✦</span> in India
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
