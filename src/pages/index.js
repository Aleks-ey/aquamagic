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
        <div className="flex flex-col lg:flex-row w-11/12 bg-blue-300 bg-gradient-to-br from-blue-500 to-white rounded-2xl lg:h-auto">
         
          <div className="flex h-full w-full pt-32 lg:p-0 lg:w-3/4 justify-center">
            <div className="flex flex-col h-full max-w-lg justify-center text-center lg:text-left">
              <h1 className="text-4xl text-white md:text-6xl pb-10">Swim With Us</h1>
              <p className="pl-10 pr-10 md:p-0 text-xl text-white md:text-3xl">
                Bure Aqua Academy is a swimming school that provides swimming lessons for all ages and abilities.
              </p>
              <Link href="/contact" className="text-blue-400 hover:text-blue-700 self-center bg-white lg:self-start mt-8 max-w-max rounded-md border-2 border-white hover:border-2 hover:border-blue-700 md:text-2xl mb-20 md:mt-14 lg:mb-0  p-3">
                Contact Us
              </Link>
            </div>
          </div>

          {/* desktop swimlanes */}
          <div className="hidden lg:flex flex-row float-right pr-20 space-x-32">
            <Image src="/Swimlane1.png" alt="Swimlane" width="32" height="0" className="z-100" />
            <Image src="/Swimlane2.png" alt="Swimlane" width="32" height="0" className="z-100" />
            <Image src="/Swimlane1.png" alt="Swimlane" width="32" height="0" className="z-100" />
            <Image src="/Swimlane2.png" alt="Swimlane" width="32" height="0" className="z-100" />
          </div>

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

      <div className="w-full p-24 pt-20 text-center"> 
        <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat purus nunc, eget vulputate nibh lobortis vulputate. In mollis nisi at diam blandit, eget suscipit arcu pulvinar.</h1>
        <hr className="mt-20"></hr>
      </div>
      {/* <div className="w-4/5 h-1 bg-black"></div> */}

      <div className="flex flex-col md:flex-row w-full pl-16 pr-16 items-center">
        <div className="flex flex-col justify-center p-0 pb-20 md:pb-0 md:pr-20 w-full md:w-2/5 text-center md:text-left">
          <h2 className="text-lg">Our Mission</h2>
          <hr></hr>
          <p className="">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat purus nunc, eget vulputate nibh lobortis vulputate. In mollis nisi at diam blandit, eget suscipit arcu pulvinar.
          </p>
          <Link href="/mission" className="text-white hover:text-blue-700 self-center bg-blue-400 lg:self-start mt-8 max-w-max rounded-md border-2 border-blue-400 hover:border-2 hover:border-blue-700 p-2">
            Learn More
          </Link>
        </div>
        <div className="flex w-full md:w-3/5 h-96 bg-blue-300 rounded-lg">
          <Image src="" className=""/>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full pt-40 pl-16 pr-16 items-center">
        <div className="flex flex-col justify-center w-full text-center pb-20 md:hidden">
          <h2 className="text-lg">Meet the Team</h2>
          <hr></hr>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat purus nunc, eget vulputate nibh lobortis vulputate. In mollis nisi at diam blandit, eget suscipit arcu pulvinar.
          </p>
          <Link href="/about" className="text-white hover:text-blue-700 self-center bg-blue-400 lg:self-end mt-8 max-w-max rounded-md border-2 border-blue-400 hover:border-2 hover:border-blue-700 p-2">
            Learn More
          </Link>
        </div>
        <div className="flex w-full md:w-3/5 h-96 bg-blue-300 rounded-lg">
          <Image src="" className=""/>
        </div>
        <div className="hidden md:flex md:flex-col justify-center pl-20 w-2/5 text-right">
          <h2 className="text-lg">Meet the Team</h2>
          <hr></hr>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat purus nunc, eget vulputate nibh lobortis vulputate. In mollis nisi at diam blandit, eget suscipit arcu pulvinar.
          </p>
          <Link href="/about" className="text-white hover:text-blue-700 self-center bg-blue-400 lg:self-end mt-8 max-w-max rounded-md border-2 border-blue-400 hover:border-2 hover:border-blue-700 p-2">
            Learn More
          </Link>
        </div>

      </div>

    </main>
  )
}
