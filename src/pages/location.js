import Image from "next/image";

const Location = () => {
    if(document.getWindowWidth < 768) {
        document.getElementById("maps").className = "phone_maps";
    }
    else {
        document.getElementById("maps").className = "desktop_maps";
    }

    return (
        <div className="flex flex-col md:flex-row pt-4 mt-20 md:mt-24 mb-40 bg-white md:bg-gradient-to-b from-pool-water to-white min-h-screen justify-center">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1753.7093445627595!2d-104.81802723961455!3d39.693305311268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c6296948f5467%3A0xc025ed099572b125!2sGateway%20High%20School!5e0!3m2!1sen!2sus!4v1693242618073!5m2!1sen!2sus" 
                width="auto" height="auto" allowFullScreen loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="maps md:rounded-md"
                id="maps">
            </iframe>

            <div className="h-auto w-0.1 bg-gray-400 ml-12"></div>

            <div className="flex flex-col md:w-1/3">
                <div className="flex flex-col md:hidden w-full h-full p-4 md:ml-12 justify-center bg-gradient-to-b md:bg-gradient-to-br from-pool-water to-white md:rounded-md">
                    <h1 className="text-lg text-center font-serif"> Instructions:</h1>
                    <ul className=" pt-6 pl-12 pr-12 space-y-1 list-disc list-outside font-serif">
                        <li className="hidden md:list-item">The
                            <p className="inline font-bold text-yellow-400"> yellow box </p> 
                            in the image above is the main parking lot where you should park.
                        </li>
                        <li className="list-item md:hidden">The
                            <p className="inline font-bold text-yellow-400"> yellow box </p> 
                            in the image below is the main parking lot where you should park.
                        </li>
                        <li>Enter the school from the main entrance south of the parking lot, highlighted by the
                            <p className="inline font-bold text-red-500"> red box </p>.
                        </li>
                        <li>Take an immediate right once you enter into the school, and head through the doors into the hallway leading to the pool.</li>
                        <li>The pool doors will be on your left as you walk down the hallway.</li>
                        <li>Enjoy your swim!</li>
                    </ul>

                    <Image src="/gateway_birdseye.png" width={400} height={400} className="flex w-full md:hidden p-4 md:pb-4 md:ml-12 rounded-md"/>
                </div>

                <Image src="/gateway_birdseye.png" width={400} height={400} className="hidden md:flex w-full md:pb-4 md:ml-12 rounded-md"/>

                <div className="hidden md:flex flex-col w-full h-full ml-12 justify-center  rounded-md">
                    <h1 className="text-2xl text-center font-serif"> Instructions:</h1>
                    <ul className=" pt-6 pl-12 pr-12 space-y-1 list-disc list-outside font-serif">
                        <li>The
                            <p className="inline font-bold text-yellow-500"> yellow box </p> 
                            in the image above is the main parking lot where you should park.
                        </li>
                        <li>Enter the school from the main entrance south of the parking lot, highlighted by the
                            <p className="inline font-bold text-red-500"> red box </p>.
                        </li>
                        <li>Take an immediate right once you enter into the school, and head through the doors into the hallway leading to the pool.</li>
                        <li>The pool doors will be on your left as you walk down the hallway.</li>
                        <li>Enjoy your swim!</li>
                    </ul>
                </div>
            </div>
            
        </div>
        
    );
}
 
export default Location;