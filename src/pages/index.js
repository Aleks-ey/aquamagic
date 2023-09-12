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


      <div className="flex flex-row mt-20 space-x-8 md:space-x-24 lg:space-x-32 justify-center">
        <Link href="https://www.usaswimming.org/">
          <Image src="/images/USAswimLogo.png" alt="USA Swimming Logo" width="100" height="0" className="z-100 w-20 h-auto" />
        </Link>
        <Link href="https://aeawave.org/">
          <Image src="/images/AEALogo.png" alt="Aquatic Exercise Association Logo" width="100" height="0" className="z-100 w-auto h-auto mt-6" />
        </Link>
        <Link href="https://aeawave.org/atri">
          <Image src="/images/ATRILogo2.png" alt="Aquatic Therapy & Rehab Institute Logo" width="100" height="0" className="z-100 w-auto h-auto mt-6" />
        </Link>
        <Link href="https://www.gomotionapp.com/team/wzcolsc/page/home">
          <Image src="/images/CSLogo.jpeg" alt="Colorado Swimming Logo" width="100" height="0" className="z-100 w-12 h-auto mt-3" />
        </Link>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-col lg:flex-row w-11/12 bg-gradient-to-br from-pool-water to-white lg:bg-gateway-pool lg:bg-cover lg:opacity-80 rounded-2xl lg:h-auto">
         
          {/* <div className="flex flex-row lg:hidden mt-2 space-x-10 justify-center">
            <Image src="/USAswimLogo.png" alt="USA Swimming Logo" width="100" height="0" className="z-100 w-1/2 h-auto" />
            <Image src="/AEALogo.png" alt="USA Swimming Logo" width="100" height="0" className="z-100 w-full h-auto" />
            <Image src="/ATRILOGO.png" alt="USA Swimming Logo" width="100" height="0" className="z-100 w-full h-auto" />
          </div> */}

          <div className="flex h-full ml-auto w-auto justify-center">
            <div className="flex flex-col h-full w-auto p-6 lg:p-0 lg:pt-20 lg:pb-20 lg:pr-7 lg:max-w-lg justify-center text-center lg:text-left lg:bg-teal-600 lg:bg-opacity-70 rounded-2xl lg:rounded-tl-none lg:rounded-bl-none">
              <h1 className="lg:text-right text-4xl text-white md:text-6xl pb-10 underline decoration-white decoration-wavy underline-offset-8">Swim With Us</h1>
              <p className="md:p-0 text-xl lg:text-right text-white md:text-3xl">
                Bure-Aqua Academy is a swimming school that shows the importance of water for life, health, and sports!
              </p>
              <Link href="/contact" className="max-w-max lg:ml-auto mt-8 mb-10 md:mt-14 lg:mb-0 p-3 text-blue-400 hover:text-blue-700 self-center bg-white lg:self-start rounded-md border-2 border-white hover:border-2 hover:border-blue-700 md:text-2xl">
                Contact Us
              </Link>
            </div>
          </div>

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

      <div className="w-full p-20 pt-6 text-center"> 
        <h2 className="text-2xl text-red-500">Why Bure?</h2>
        <p>The founders of this academy are Natalia and Vladimir Bure. Certified specialists with over 30 years of experience!</p>
        
        <h2 className="pt-4 text-2xl text-red-500">Why Aqua?</h2>
        <p>Aqua – water... This is a unique environment for our body. And our mission is to show the importance of water for life, health and sports!</p>
        
        <h2 className="pt-4 text-2xl text-red-500">Why Academy?</h2>
        <p>An academic approach and teaching principles are used: from simple to complex, 
          improving skills (including participation in sports competitions), 
          taking into account the individual characteristics of each person, 
          using a variety of methodological techniques, homework, joint work with parents and much more. 
          The sports club and specialists are accredited by USA Swimming Inc. , 
          have more than 30 years of experience and certificates from the American Red Cross and Aquatic Exercise Association. 
          <br/>We will teach you CORRECT SWIMMING.</p>
        {/* <p className="text-xl">Aqua – water... This is a unique environment for our body. 
        <br/> And our mission is to show the importance of water for life, health, and sports!</p> */}
        <hr className="mt-20 border-black invisible lg:visible"></hr>
      </div>
      {/* <div className="w-4/5 h-1 bg-black"></div> */}

      <div className="flex flex-col lg:flex-row w-full pl-16 pr-16 items-center">
        <div className="flex flex-col justify-center p-0 pb-20 lg:pb-0 lg:pr-20 w-full lg:w-2/5 text-center lg:text-left">
          <h2 className="text-lg">Our Program</h2>
          <hr className="border-black"></hr>
          <p className="">
          Our mission is to use an academic approach, with proper teaching principals, to elevate all of our students and constantly improve their swimming skills.
          From simple to complex, 
          improving skills (including participation in sports competitions), 
          taking into account the individual characteristics of each person, 
          using a variety of methodological techniques, homework, joint work with parents, and much more.
          </p>
          <Link href="/mission" className="text-white hover:text-blue-700 self-center bg-blue-400 lg:self-start mt-8 max-w-max rounded-md border-2 border-blue-400 hover:border-2 hover:border-blue-700 p-2">
            Learn More
          </Link>
        </div>
        <div className="flex w-full lg:w-3/5 h-80 bg-blue-300 rounded-lg">
          <Image src="/SwimComp.jpeg" width={300} height={300} className="object-cover w-full rounded-lg"/>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full pt-40 pl-16 pr-16 pb-40 items-center">
        <div className="flex flex-col justify-center w-full text-center pb-20 lg:hidden">
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
        <div className="flex w-full lg:w-3/5 h-72 bg-blue-300 rounded-lg">
          <Image src="/NataliaTeachingKid2.png" width={300} height={300} className="hidden md:flex w-full md:w-1/2 rounded-lg lg:rounded-tl-lg lgrounded-bl-lg lg:rounded-tr-none lg:rounded-br-none"/>
          <Image src="/Natalia&Vladimir.jpg" width={300} height={300} className="w-full md:hidden md:w-1/2 rounded-lg lg:rounded-tl-lg lgrounded-bl-lg lg:rounded-tr-none lg:rounded-br-none"/>
          <Image src="/VladimirTeachingKid.jpg" width={300} height={300} className="hidden md:flex w-1/2 rounded-tr-lg rounded-br-lg"/>
        </div>

        <div className="hidden lg:flex lg:flex-col justify-center pl-20 w-2/5 text-right">
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
