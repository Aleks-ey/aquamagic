import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: 0,
      height: 0,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
       
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

  var size = useWindowSize();

  return (
    <main className="bg-white">

      <div className="flex pt-14 md:pt-20 justify-center">
        <div className="flex flex-col mt-10 lg:flex-row w-11/12 bg-gradient-to-br from-pool-water to-white lg:bg-gateway-pool lg:bg-cover lg:opacity-80 rounded-2xl lg:h-auto">
         
          <div className="flex h-full w-auto justify-center">
            <div className="flex flex-col h-full w-auto p-6 lg:p-0 lg:pt-20 lg:pb-20 lg:pl-7 lg:max-w-lg justify-center text-center lg:text-left lg:bg-black lg:bg-opacity-70 rounded-2xl lg:rounded-tr-none lg:rounded-br-none">
              <h1 className="text-4xl text-white md:text-6xl pb-10 underline decoration-blue-500 decoration-wavy underline-offset-8">Swim With Us</h1>
              <p className="md:p-0 text-xl text-white md:text-3xl">
                Bure-Aqua Academy is a swimming school that provides swimming lessons for all ages and abilities.
              </p>
              <Link href="/contact" className="max-w-max mt-8 mb-10 md:mt-14 lg:mb-0 p-3 text-blue-400 hover:text-blue-700 self-center bg-white lg:self-start rounded-md border-2 border-white hover:border-2 hover:border-blue-700 md:text-2xl">
                Contact Us
              </Link>
            </div>
          </div>
          {/* <div>
            <Image src="/USAswimLogo.png" alt="USA Swimming Logo" width="100" height="0" className="z-100 w-auto h-auto" />
            <Image src="/AEALogo.png" alt="USA Swimming Logo" width="100" height="0" className="z-100 w-auto h-auto" />
            <Image src="/ATRILOGO.png" alt="USA Swimming Logo" width="100" height="0" className="z-100 w-auto h-auto" />
          </div> */}
          

          {/* desktop swimlanes */}
          {/* <div className="hidden lg:flex flex-row float-right pr-40 space-x-32">
            <Image src="/Swimlane1.png" alt="Swimlane" width="32" height="0" className="z-100" />
            <Image src="/Swimlane2.png" alt="Swimlane" width="32" height="0" className="z-100" />
            <Image src="/Swimlane1.png" alt="Swimlane" width="32" height="0" className="z-100" />
            <Image src="/Swimlane2.png" alt="Swimlane" width="32" height="0" className="z-100" />
          </div> */}
          {/* <Image src="/gateway_pool.jpg" alt="Swimlane" width="600" height="0" className="z-100 rounded-tr-md rounded-br-md" /> */}

          {/* tablet swimlanes */}
          <div className="md:flex h-full items-end hidden lg:hidden">
            <div className="md:flex flex-col space-y-24 w-full pb-16 hidden lg:hidden">
              <Image src="/Swimlane1-horiz.png" alt="Swimlane" width={size.width} height="0" className="z-100" />
              <Image src="/Swimlane2-horiz.png" alt="Swimlane" width={size.width} height="0" className="z-100" />
              <Image src="/Swimlane1-horiz.png" alt="Swimlane" width={size.width} height="0" className="z-100" />
              {/* <Image src="/Swimlane2-horiz.png" alt="Swimlane" width={size.width} height="0" className="z-100" /> */}
            </div>
          </div>

          {/* mobile swimlanes */}
          <div className="flex h-full items-end md:hidden">
            <div className="flex flex-col space-y-16 w-full pb-16 md:hidden">
              <Image src="/Swimlane1-horiz.png" alt="Swimlane" width={size.width} height="0" className="z-100" />
              <Image src="/Swimlane2-horiz.png" alt="Swimlane" width={size.width} height="0" className="z-100" />
              <Image src="/Swimlane1-horiz.png" alt="Swimlane" width={size.width} height="0" className="z-100" />
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="flex flex-row mt-4 space-x-64 justify-center">
        <Link href="https://www.usaswimming.org/">
          <Image src="/USAswimLogo.png" alt="USA Swimming Logo" width="100" height="0" className="z-100 w-auto h-auto" />
        </Link>
        <Link href="https://aeawave.org/">
          <Image src="/AEALogo.png" alt="Aquatic Exercise Association Logo" width="100" height="0" className="z-100 w-auto h-auto pt-2" />
        </Link>
        <Link href="https://aeawave.org/atri">
          <Image src="/ATRILOGO.png" alt="Aquatic Therapy & Rehab Institute Logo" width="100" height="0" className="z-100 w-auto h-auto pt-1" />
        </Link>
      </div>

      <div className="w-full p-20 pt-20 text-center"> 
        <p className="text-xl">Aqua – water... This is a unique environment for our body. 
        <br/> And our mission is to show the importance of water for life, health, and sports!</p>
        <hr className="mt-20 border-black invisible lg:visible"></hr>
      </div>
      {/* <div className="w-4/5 h-1 bg-black"></div> */}

      <div className="flex flex-col md:flex-row w-full pl-16 pr-16 items-center">
        <div className="flex flex-col justify-center p-0 pb-20 md:pb-0 md:pr-20 w-full md:w-2/5 text-center md:text-left">
          <h2 className="text-lg">Our Mission</h2>
          <hr className="border-black"></hr>
          <p className="">
          From simple to complex, 
          improving skills (including participation in sports competitions), 
          taking into account the individual characteristics of each person, 
          using a variety of methodological techniques, homework, joint work with parents, and much more. 
          Our mission is to use an academic approach, with proper teaching principals, to elevate all of our students and constantly improve their swimming skills. 
          We will teach you CORRECT SWIMMING.
          </p>
          <Link href="/mission" className="text-white hover:text-blue-700 self-center bg-blue-400 lg:self-start mt-8 max-w-max rounded-md border-2 border-blue-400 hover:border-2 hover:border-blue-700 p-2">
            Learn More
          </Link>
        </div>
        <div className="flex w-full md:w-3/5 h-96 bg-blue-300 rounded-lg">
          <Image src="/SwimComp.jpeg" width={300} height={300} className="object-cover w-full rounded-lg"/>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full pt-40 pl-16 pr-16 pb-40 items-center">
        <div className="flex flex-col justify-center w-full text-center pb-20 md:hidden">
          <h2 className="text-lg">Meet the Team</h2>
          <hr className="border-black"></hr>
          <p>
          The founders of this academy are Natalia and Vladimir Bure. Certified specialists with over 30 years of experience!
          </p>
          <Link href="/about" className="text-white hover:text-blue-700 self-center bg-blue-400 lg:self-end mt-8 max-w-max rounded-md border-2 border-blue-400 hover:border-2 hover:border-blue-700 p-2">
            Learn More
          </Link>
        </div>
        <div className="flex w-full md:w-3/5 h-96 bg-blue-300 rounded-lg">
          <Image src="/NataliaTeachingKid2.png" width={300} height={300} className=" w-1/2 rounded-tl-lg rounded-bl-lg"/>
          {/* <Image src="/Natalia&Vladimir.jpg" width={300} height={300} className="w-1/3"/> */}
          <Image src="/VladimirTeachingKid.jpg" width={300} height={300} className="w-1/2 rounded-tr-lg rounded-br-lg"/>
        </div>

        <div className="hidden md:flex md:flex-col justify-center pl-20 w-2/5 text-right">
          <h2 className="text-lg">Meet the Team</h2>
          <hr className="border-black"></hr>
          <p>
          The founders of this academy are Natalia and Vladimir Bure. Certified specialists with over 30 years of experience!
          They are fully dedicated to their craft and are passionate about teaching swimming to all ages and abilities.
          Natalia and Vladimir work together to foster a community of swimmers who are confident in the water and love swimming.
          </p>
          <Link href="/about" className="text-white hover:text-blue-700 self-center bg-blue-400 lg:self-end mt-8 max-w-max rounded-md border-2 border-blue-400 hover:border-2 hover:border-blue-700 p-2">
            Learn More
          </Link>
        </div>

      </div>

    </main>
  )
}
