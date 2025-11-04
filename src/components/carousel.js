import { useState } from "react";
import Image from "next/image";

function Carousel({ images }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative flex flex-col items-center">
      <Image
        src={images[index]}
        alt={`Slide ${index + 1}`}
        width={400}
        height={300}
        className="rounded-md"
      />
      <div className="flex justify-between w-full mt-4">
        <button onClick={prev} className="bg-gray-300 px-4 py-2 rounded">
          Prev
        </button>
        <button onClick={next} className="bg-gray-300 px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
}

export default Carousel;
