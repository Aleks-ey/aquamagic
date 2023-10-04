import Image from "next/image";

const Schedule = () => {
    return (
        <div className="flex mb-32 bg-white min-h-screen mt-12 md:pt-20 justify-center">
            <div className="flex bg-gradient-to-br from-pool-water to-white w-11/12 h-auto rounded-md">
                
                <Image src="/ScheduleOct23.png" width="1000" height="1000" className="hidden md:block w-full h-full rounded-md"/>
                <Image src="/Schedule.png" width="1000" height="200" className="md:hidden w-full rounded-md"/>
                {/* <div className="grid grid-cols-7 gap-4 w-11/12 mx-auto mt-12 mb-12 font-sans">
                    <div className="col-span-1 bg-gray-200 p-2 text-center font-bold">
                        Sun
                    </div>
                    <div className="col-span-1 bg-gray-200 p-2 text-center font-bold">
                        Mon
                    </div>
                    <div className="col-span-1 bg-gray-200 p-2 text-center font-bold">
                        Tue
                    </div>
                    <div className="col-span-1 bg-gray-200 p-2 text-center font-bold">
                        Wed
                    </div>
                    <div className="col-span-1 bg-gray-200 p-2 text-center font-bold">
                        Thu
                    </div>
                    <div className="col-span-1 bg-gray-200 p-2 text-center font-bold">
                        Fri
                    </div>
                    <div className="col-span-1 bg-gray-200 p-2 text-center font-bold">
                        Sat
                    </div>
                    {[...Array(31).keys()].map(day => (
                        <div className="col-span-1 p-2 border border-gray-600 flex flex-col justify-between" key={day}>
                            <span className="text-sm text-center">{day + 1}</span>
                            <div className="border-t border-gray-500 flex-grow mt-1 p-10"></div>
                        </div>
                    ))}
                </div> */}

            </div>
        </div>
    );
}
 
export default Schedule;