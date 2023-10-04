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
            <div className=" px-6 py-2 md:px-4 lg:px-14">
                <div className="flex items-center w-full justify-between">
                    {/* Logo and title */}
                    <div className="flex items-center">
                        <div className="hidden lg:block">
                            <Image src="/Logo_Bure-Aqua3.png" alt="Logo" width={80} height={40} />
                        </div>
                        <div className="hidden md:block lg:hidden">
                            <Image src="/Logo_Bure-Aqua3.png" alt="Logo" width={70} height={40} />
                        </div>
                        <div className="block md:hidden">
                            <Image src="/Logo_Bure-Aqua3.png" alt="Logo" width={60} height={40} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="ml-2 md:text-xl lg:text-2xl font-semibold text-blue-900">
                                <Link href="/">
                                Bure-Aqua Academy
                                </Link>
                            </h1>
                            <h2 className="ml-2 text-base lg:text-l text-sky-500">
                                <Link href="/">
                                    For Life, Health, and Sport
                                </Link>
                            </h2>
                        </div>
                    </div>
            
                    {/* Desktop navigation */}
                    <nav className="hidden md:flex ml-auto md:space-x-3 md:text-md lg:space-x-4 lg:text-l font-bold">
                        <Link href="/" className="text-blue-900 hover:text-blue-600">
                            Home
                        </Link>
                        <Link href="/about" className="text-blue-900 hover:text-blue-600">
                            About Us
                        </Link>
                        <Link href="/location" className="text-blue-900 hover:text-blue-600">
                            Location
                        </Link>
                        <Link href="/schedule" className="text-blue-900 hover:text-blue-600">
                            Schedule
                        </Link>
                        {/* <Link href="/programmes" className="hover:text-blue-600">
                            Programmes
                        </Link> */}
                        <Link href="/contact" className="text-blue-900 hover:text-blue-600">
                            Contact Us
                        </Link>
                        
                    </nav>
                        
                    <Link href="/registration" className="hidden md:flex p-2 ml-3 text-white hover:text-black bg-sky-500 snap-end rounded-md">
                        Register Now
                    </Link>

                    {/* Hamburger menu button */}
                    <button
                    className="ml-auto md:hidden focus:outline-none"
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
                                <Link href="/" className="block py-1 px-2 hover:text-blue-600" onClick={toggleMobileMenu}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="block py-1 px-2 hover:text-blue-600" onClick={toggleMobileMenu}>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/location" className="block py-1 px-2 hover:text-blue-600" onClick={toggleMobileMenu}>
                                    Location
                                </Link>
                            </li>
                            <li>
                                <Link href="/schedule" className="block py-1 px-2 hover:text-blue-600" onClick={toggleMobileMenu}>
                                    Schedule
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/programmes" className="block py-1 px-2 hover:text-blue-600">
                                    Programmes
                                </Link>
                            </li> */}
                            {/* <li>
                                <Link href="/services" className="block py-1 px-2 hover:text-blue-600">
                                    Services
                                </Link>
                            </li> */}
                            <li>
                                <Link href="/contact" className="block py-1 px-2 hover:text-blue-600"> onClick={toggleMobileMenu}
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/registration" className="block py-1 px-2 hover:text-blue-600" onClick={toggleMobileMenu}>
                                    Register Now
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