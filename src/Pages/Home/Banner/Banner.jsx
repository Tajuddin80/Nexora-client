import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const panels = [
  {
    title: "Commercial",
    img: "https://i.ibb.co/Tx8gYr6c/slider1.webp",
  },
  {
    title: "Wellness Communities",
    img: "https://i.ibb.co/93402MQV/slider3.webp",
  },
  {
    title: "Commercial",
    img: "https://i.ibb.co/HL38Mr6w/slider2.webp",
  },
  {
    title: "Classic",
    img: "https://i.ibb.co/Zt61jT5/slider5.webp",
  },
  {
    title: "Luxury",
    img: "https://i.ibb.co/h18mBQn9/slider4.webp",
  },
];

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0); 
  const hoverRef = useRef(false);
  const slideInterval = useRef(null);

  // Auto slide function
  useEffect(() => {
    if (!hoverRef.current) {
      slideInterval.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % panels.length);
      }, 4000); // slide every 4 seconds
    }

    return () => clearInterval(slideInterval.current);
  }, [activeIndex]);

  const handleMouseEnter = (i) => {
    hoverRef.current = true;
    clearInterval(slideInterval.current);
    setActiveIndex(i);
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    slideInterval.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % panels.length);
    }, 4000);
  };

  const visiblePanels = panels.slice(0, 3);

  return (
    <div className="flex min-w-full h-[70vh] mx-auto overflow-hidden rounded-xl shadow-2xl">
      {/* Small & medium screens: show first 3 */}
      <div className="flex w-full lg:hidden">
        {visiblePanels.map((panel, i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden cursor-pointer transition-all duration-500"
            style={{
              flex: activeIndex === i ? 4 : 1,
            }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            <Link rel="noopener noreferrer">
              <img
                src={panel.img}
                alt={panel.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-2xl font-bold"></div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Large screens: show all */}
      <div className="hidden lg:flex w-full">
        {panels.map((panel, i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden cursor-pointer transition-all duration-500"
            style={{
              flex: activeIndex === i ? 4 : 1,
            }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            <Link rel="noopener noreferrer">
              <img
                src={panel.img}
                alt={panel.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-2xl font-bold"></div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
