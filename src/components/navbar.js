import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';

import 'font-awesome/css/font-awesome.min.css';

const Navbar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white text-black">
            <div className=" px-6 py-2 md:px-10 lg:px-14">
                <div className="flex items-center justify-between">
                    {/* Logo and title */}
                    <div className="flex items-center">
                        <div className="hidden lg:block">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} />
                        </div>
                        <h1 className="ml-2 text-xl md:text-2xl lg:text-4xl font-semibold">
                            <Link href="/">
                            My Website
                            </Link>
                        </h1>
                    </div>
            
                    {/* Desktop navigation */}
                    <nav className="hidden md:flex md:space-x-3 md:text-md lg:space-x-4 lg:text-xl">
                        <Link href="/mission" className="hover:text-blue-600">
                            Mission
                        </Link>
                        <Link href="/about" className="hover:text-blue-600">
                            About Us
                        </Link>
                        <Link href="/location" className="hover:text-blue-600">
                            Location
                        </Link>
                        <Link href="/schedule" className="hover:text-blue-600">
                            Schedule
                        </Link>
                        <Link href="/programmes" className="hover:text-blue-600">
                            Programmes
                        </Link>
                        <Link href="/services" className="hover:text-blue-600">
                            Services
                        </Link>
                        <Link href="/contact" className="hover:text-blue-600">
                            Contact Us
                        </Link>
                    </nav>
            
                    {/* Hamburger menu button */}
                    <button
                    className=" md:hidden focus:outline-none"
                    onClick={toggleMobileMenu}
                    >
                        <i className="fas fa-bars not-italic"></i>
                    </button>
                </div>
            
                {/* Mobile navigation */}
                {isMobileMenuOpen && (
                    <nav className="md:hidden mt-2">
                        <ul className="flex flex-col space-y-2">
                            <li>
                                <Link href="/mission" className="block py-1 px-2 hover:text-blue-600">
                                    Mission
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="block py-1 px-2 hover:text-blue-600">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/location" className="block py-1 px-2 hover:text-blue-600">
                                    Location
                                </Link>
                            </li>
                            <li>
                                <Link href="/schedule" className="block py-1 px-2 hover:text-blue-600">
                                    Schedule
                                </Link>
                            </li>
                            <li>
                                <Link href="/programmes" className="block py-1 px-2 hover:text-blue-600">
                                    Programmes
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="block py-1 px-2 hover:text-blue-600">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="block py-1 px-2 hover:text-blue-600">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Navbar;