import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import "font-awesome/css/font-awesome.min.css";
import { useAuth } from "@/utils/AuthContext";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";

function getInitials(profile) {
  if (!profile) return "?";
  const first = profile.first_name?.[0] ?? "";
  const last = profile.last_name?.[0] ?? "";
  return (first + last).toUpperCase();
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDonatePopupOpen, setIsDonatePopupOpen] = useState(false);
  const [mobileMode, setMobileMode] = useState("nav");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      if (prev === true && next === false) setMobileMode("nav"); // closing -> reset
      return next;
    });
  };

  const toggleDonatePopup = () => {
    setIsDonatePopupOpen(!isDonatePopupOpen);
  };

  //   user auth logic
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white text-black">
      <div className="px-6 py-2 md:px-4 lg:px-14">
        <div className="flex items-center w-full justify-between">
          {/* Logo and title */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex relative w-16 h-16">
                <Image
                  src="/Logo_Bure-Aqua3.png"
                  alt="Logo"
                  fill={true}
                  priority={true}
                  className="w-auto h-auto"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 25vw"
                />
              </div>
            </Link>
            <div className="flex flex-col">
              <h1 className="ml-2 text-lg md:text-xl lg:text-2xl font-semibold text-blue-900">
                <Link href="/">Bure-Aqua Academy</Link>
              </h1>
              <h2 className="ml-2 md:text-lg lg:text-xl text-sky-500">
                <Link href="/">For Life, Health, and Sport</Link>
              </h2>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex ml-auto md:space-x-3 md:text-md lg:space-x-4 lg:text-lg font-bold">
            <Link href="/" className="text-blue-900 hover:text-blue-600">
              Home
            </Link>
            <Link href="/about" className="text-blue-900 hover:text-blue-600">
              About Us
            </Link>
            <Link
              href="/location"
              className="text-blue-900 hover:text-blue-600"
            >
              Location
            </Link>

            {/* Dropdown container */}
            <div className="schedule_dropdown relative">
              <Link
                href="/schedule"
                className="text-blue-900 hover:text-blue-600 cursor-pointer"
              >
                Schedule
              </Link>
              <div className="dropdown-content hidden absolute left-0 bg-white shadow-md z-10">
                <Link
                  href="/calendar"
                  className="block py-2 px-4 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                >
                  Calendar
                </Link>
                <Link
                  href="/events"
                  className="block py-2 px-4 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                >
                  Events
                </Link>
              </div>
            </div>

            <Link href="/contact" className="text-blue-900 hover:text-blue-600">
              Contact Us
            </Link>
          </nav>

          <Link
            href="/registration"
            className="hidden md:flex p-2 ml-3 text-white bg-pool-water hover:text-pool-water hover:bg-white border-2 border-pool-water snap-end rounded-md"
          >
            Register Now
          </Link>
          <button
            className="hidden md:flex p-2 ml-3 text-white bg-pool-water hover:text-pool-water hover:bg-white border-2 border-pool-water snap-end rounded-md"
            onClick={toggleDonatePopup}
          >
            Donate
          </button>
          {/* Desktop user button + hover dropdown */}
          <div className="relative hidden md:flex ml-4 group">
            {/* Avatar button (click routes) */}
            <button
              onClick={() => {
                if (!user) router.push("/auth/signin");
                else router.push("/dashboard");
              }}
              className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold
               flex items-center justify-center hover:bg-blue-700"
            >
              {profile ? getInitials(profile) : "?"}
            </button>

            {/* Dropdown (hover only) */}
            {profile && (
              <div
                className="
                    absolute right-0 top-full
                    w-44 bg-white border rounded-md shadow-lg z-50
                    opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible
                    transition-opacity duration-150
                "
              >
                {/* Hover bridge: prevents dropdown from collapsing when moving mouse down */}
                <div className="absolute -top-3 left-0 right-0 h-3"></div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => router.push("/settings")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </button>

                {(profile.role === "coach" || profile.role === "admin") && (
                  <button
                    onClick={() => router.push("/coach")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Coach Panel
                  </button>
                )}

                {profile.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger menu button */}
          <button
            className="ml-auto md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <i className="fa fa-solid fa-bars"></i>
          </button>
        </div>

        {/* Mobile navigation */}
      </div>
      <div>
        {isMobileMenuOpen && (
          //   <nav className="md:hidden mt-12 py-10 border-2 h-screen bg-gradient-to-b from-white to-blue-300">
          //     <ul className="flex flex-col space-y-4 text-center text-2xl">
          //       <li>
          //         <Link
          //           href="/"
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={toggleMobileMenu}
          //         >
          //           Home
          //         </Link>
          //       </li>
          //       <li>
          //         <Link
          //           href="/about"
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={toggleMobileMenu}
          //         >
          //           About Us
          //         </Link>
          //       </li>
          //       <li>
          //         <Link
          //           href="/location"
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={toggleMobileMenu}
          //         >
          //           Location
          //         </Link>
          //       </li>
          //       <li>
          //         <Link
          //           href="/schedule"
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={toggleMobileMenu}
          //         >
          //           Schedule
          //         </Link>
          //       </li>
          //       <li>
          //         <Link
          //           href="/calendar"
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={toggleMobileMenu}
          //         >
          //           Calendar
          //         </Link>
          //       </li>
          //       <li>
          //         <Link
          //           href="/events"
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={toggleMobileMenu}
          //         >
          //           Events
          //         </Link>
          //       </li>
          //       <li>
          //         <Link
          //           href="/contact"
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={toggleMobileMenu}
          //         >
          //           Contact Us
          //         </Link>
          //       </li>
          //       <li>
          //         <Link
          //           href="/registration"
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={toggleMobileMenu}
          //         >
          //           Register Now
          //         </Link>
          //       </li>
          //       <li>
          //         <a
          //           className="block py-1 px-2 hover:text-blue-600"
          //           onClick={() => {
          //             toggleMobileMenu();
          //             toggleDonatePopup();
          //           }}
          //         >
          //           Donate
          //         </a>
          //       </li>
          //       {/* user menu items */}
          //       <li>
          //         {!user ? (
          //           <Link href="/auth/signin" onClick={toggleMobileMenu}>
          //             Sign In
          //           </Link>
          //         ) : (
          //           <>
          //             <Link href="/dashboard" onClick={toggleMobileMenu}>
          //               Dashboard
          //             </Link>

          //             <Link href="/settings" onClick={toggleMobileMenu}>
          //               Settings
          //             </Link>

          //             {(profile?.role === "coach" ||
          //               profile?.role === "admin") && (
          //               <Link href="/coach" onClick={toggleMobileMenu}>
          //                 Coach Panel
          //               </Link>
          //             )}

          //             {profile?.role === "admin" && (
          //               <Link href="/admin" onClick={toggleMobileMenu}>
          //                 Admin Panel
          //               </Link>
          //             )}

          //             <button
          //               onClick={async () => {
          //                 await handleSignOut();
          //                 toggleMobileMenu();
          //               }}
          //               className="text-red-600"
          //             >
          //               Sign Out
          //             </button>
          //           </>
          //         )}
          //       </li>
          //     </ul>
          //   </nav>
          <nav className="md:hidden h-[calc(100vh-3rem)] overflow-hidden">
            <div
              className={`relative h-full w-full
                pt-6 pb-24 content-center
                transition-colors duration-1000
                ${
                  mobileMode === "user"
                    ? "bg-gradient-to-b from-blue-300 to-blue-700"
                    : "bg-gradient-to-b from-white to-blue-300"
                }`}
            >
              {/* NAV MENU (slides up + becomes non-interactive) */}
              <div
                className={`transition-all duration-700
                    ${
                      mobileMode === "user"
                        ? "-translate-y-12 opacity-0 pointer-events-none"
                        : "translate-y-0 opacity-100 pointer-events-auto"
                    }`}
              >
                <ul className="flex flex-col space-y-4 text-center text-2xl">
                  <li>
                    <Link href="/" onClick={toggleMobileMenu}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" onClick={toggleMobileMenu}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/location" onClick={toggleMobileMenu}>
                      Location
                    </Link>
                  </li>
                  <li>
                    <Link href="/schedule" onClick={toggleMobileMenu}>
                      Schedule
                    </Link>
                  </li>
                  <li>
                    <Link href="/calendar" onClick={toggleMobileMenu}>
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" onClick={toggleMobileMenu}>
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" onClick={toggleMobileMenu}>
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/registration" onClick={toggleMobileMenu}>
                      Register Now
                    </Link>
                  </li>
                  <li>
                    <button
                      className="block w-full py-1 px-2 hover:text-blue-600"
                      onClick={() => {
                        toggleMobileMenu();
                        toggleDonatePopup();
                      }}
                    >
                      Donate
                    </button>
                  </li>
                </ul>
              </div>

              {/* USER ICON (starts at bottom, moves to top) */}
              <div
                className={`absolute left-1/2 -translate-x-1/2
                    duration-1000 transition-all
                    ${
                      mobileMode === "user"
                        ? "top-6 scale-105"
                        : "bottom-20 scale-100"
                    }`}
              >
                <button
                  onClick={() =>
                    setMobileMode(mobileMode === "nav" ? "user" : "nav")
                  }
                  className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center"
                >
                  {profile ? (
                    getInitials(profile)
                  ) : (
                    <i className="fa fa-user" />
                  )}
                </button>
              </div>

              {/* USER MENU (slides in below icon + becomes interactive) */}
              <div
                className={`absolute left-0 right-0 top-28 transition-all duration-700
                    ${
                      mobileMode === "user"
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "translate-y-12 opacity-0 pointer-events-none"
                    }`}
              >
                <ul className="flex flex-col space-y-4 text-center text-2xl text-white">
                  {!user ? (
                    <li>
                      <Link href="/auth/signin" onClick={toggleMobileMenu}>
                        Sign In
                      </Link>
                    </li>
                  ) : (
                    <>
                      <li>
                        <Link href="/dashboard" onClick={toggleMobileMenu}>
                          Dashboard
                        </Link>
                      </li>

                      <li>
                        <Link href="/settings" onClick={toggleMobileMenu}>
                          Settings
                        </Link>
                      </li>

                      {(profile?.role === "coach" ||
                        profile?.role === "admin") && (
                        <li>
                          <Link href="/coach" onClick={toggleMobileMenu}>
                            Coach Panel
                          </Link>
                        </li>
                      )}

                      {profile?.role === "admin" && (
                        <li>
                          <Link href="/admin" onClick={toggleMobileMenu}>
                            Admin Panel
                          </Link>
                        </li>
                      )}

                      <li>
                        <button
                          onClick={async () => {
                            await handleSignOut();
                            toggleMobileMenu();
                          }}
                          className="text-red-300"
                        >
                          Sign Out
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        )}
      </div>
      {/* Donate Popup */}
      {isDonatePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg justify-center text-center text-sm md:text-lg w-11/12 md:w-1/2">
            <h2 className="font-bold text-xl">Donations and Sponsors</h2>
            <p>
              Thank you for considering a donation to the Bure-Aqua Academy!
              Your generous support plays a vital role in the development of our
              dedicated swimmers and our future projects for kids.
            </p>
            <br />
            <p>
              Every contribution you make is directly invested in our team's
              growth and success. Your donations are essential for funding
              various aspects of our team, including: Pool rental fees,
              Equipment and supplies, Swim Competitions, Uniforms, and more.
            </p>
            <br />
            <p>
              For those who prefer a quick and convenient way to donate, we
              gladly accept contributions via Zelle. Please use the following
              details to make your donation:
            </p>
            <br />
            <p>
              <strong>Recipient:</strong> Bure-Aqua Academy
            </p>
            <p>
              <strong>Phone Number:</strong> (720) 363-1019
            </p>
            <br />
            <p>
              If you have some questions about donations or being a sponsor,
              please send your contact information to aquamagicnb@gmail.com
            </p>
            <br />
            <button
              className="px-4 py-1 text-pool-water hover:text-white hover:bg-pool-water border-2 border-pool-water"
              onClick={toggleDonatePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        /* Desktop navigation dropdown styles */
        .group-hover:block {
          display: none;
        }

        .schedule_container:hover .group-hover:block {
          display: block;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
