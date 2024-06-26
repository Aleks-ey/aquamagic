import Image from 'next/image'

const About = () => {
    return (
        <div className="flex flex-col mt-12 md:mt-32 bg-white min-h-screen justify-center items-center">
            <div className="flex mt-16 justify-center">
                <h1 className="px-4 md:px-12 text-4xl md:text-4xl lg:text-5xl text-center font-serif font-bold">Making Ripples in Our Community: Get to Know Us!</h1>
            </div>
            <div className="flex flex-col md:pt-12 bg-gradient-to-t from-pool-water h-auto w-full">
                {/* BUOY LINE */}
                <div className="flex flex-shrink h-full pt-16">
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                </div>
                {/* VLADIMIR PIC & BIO */}
                <div className="flex flex-col lg:flex-row p-12 lg:space-x-4 h-full w-full">
                    <Image src="/VladimirHeadshot.jpg" alt="Swim coach Vladimir Bure"
                        width={300} height={300} priority={true} 
                        className="place-self-center rounded-md w-auto h-auto"
                        sizes='(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 25vw'
                    />
                    <div className="flex flex-col p-2 pt-8 md:p-12 self-center text-center lg:text-left">
                        <h2 className="mb-6 text-3xl font-bold">Vladimir Bure</h2>
                        <p className="text-xl">
                        Vladimir Bure is the head coach of Bure-Aqua Academy, LLC (CO). 
                        Candidate for Master of Sports, member of the American Swimming Coaches Association since 2002 (ASCA USA). 
                        Member of USA Swimming Inc. Graduate of the St. Petersburg State University of Physical Culture named after. P.F. Lesgaft (1998).
                        Founder, head coach of the Russian-American swimming school and the official USA Swimming team “BURE-AQUA” (2002-2008).
                        </p>
                    </div>
                </div>
            </div>
            {/* BUOY LINE */}
            <div className="flex flex-col bg-pool-water h-auto w-full">
                <div className="flex flex-shrink h-full">
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                </div>
            </div>
            <div className="flex flex-col mb-32 bg-gradient-to-b from-pool-water h-auto w-full">
                {/* NATALIA PIC & BIO */}
                <div className="flex flex-col-reverse lg:flex-row p-12 h-full w-full justify-end">
                    <div className="flex flex-col p-2 pt-8 md:p-12 self-center text-center lg:text-left">
                        <h2 className="mb-6 text-3xl font-bold">Natalia Bure</h2>
                        <p className="text-xl">
                        Natalia Bure is the director and a coach of Bure-Aqua Academy, LLC (CO). 
                        Certified Aquatic Specialist (USA). Pediatrician, PhD in Medicine, Associate Professor, specialist in sports medicine, hydrokinesitherapy, medical rehabilitation. 
                        Author of therapeutic and health programs for hydrokinesitherapy, including for babies 1 year of age (“Smart Small Fish”). 
                        Member of the International Aquatic Fitness Association since 2006 (Aquatic Exercise Association) and USA Swimming Inc (since 2002).
                        </p>
                    </div>
                    <Image src="/NataliaHeadshot.jpg" alt="Swim instructor Natalia Bure"
                        width={300} height={300} priority={true} 
                        className="place-self-center rounded-md w-auto h-auto"
                        sizes='(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 25vw'
                    />
                </div>
                {/* BUOY LINE */}
                <div className="flex flex-shrink h-full pb-16">
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-buoy-orange h-6 w-1/12 rounded-md"></div>
                    <div className="bg-black h-6 w-1"></div>
                    <div className="bg-white h-6 w-1/12 rounded-md"></div>
                </div>
            </div>
        </div>
    );
}
 
export default About;