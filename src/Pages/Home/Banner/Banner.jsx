import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import blackImg from "../../../assets/black.webp";
import building3Img from "../../../assets/building-3.webp";
import building4Img from "../../../assets/building-4.webp";
import building5Img from "../../../assets/building-5.webp";
import building6Img from "../../../assets/building-6.webp";

const panels = [
  {
    title: "Luxury Residences",
    subtitle: "High-rise modern apartments with panoramic city views",
    img: building6Img,
  },
  {
    title: "Modern Architecture",
    subtitle: "Eco-friendly design with premium architectural finishes",
    img: building5Img,
  },
  {
    title: "Commercial Suites",
    subtitle: "Prime executive spaces for businesses & lifestyle",
    img: building4Img,
  },
  {
    title: "Classic Living",
    subtitle: "Spacious interiors designed for comfort & privacy",
    img: building3Img,
  },
  {
    title: "Penthouse Views",
    subtitle: "Exclusive rooftop gardens & keyless smart access",
    img: blackImg,
  },
];

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0); 
  const hoverRef = useRef(false);
  const slideInterval = useRef(null);

  useEffect(() => {
    if (!hoverRef.current) {
      slideInterval.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % panels.length);
      }, 4000);
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
    <div className="flex w-full h-[70vh] overflow-hidden rounded-none shadow-md border-b-2 border-base-content/20">
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
            <div className="w-full h-full relative group">
              <img
                src={panel.img}
                alt={panel.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                  NEXORA Luxury
                </span>
                <h3 className="text-xl font-black uppercase tracking-wide text-white">
                  {panel.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Large screens: show all 5 */}
      <div className="hidden lg:flex w-full">
        {panels.map((panel, i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden cursor-pointer transition-all duration-500 border-r border-white/20 last:border-r-0"
            style={{
              flex: activeIndex === i ? 4 : 1,
            }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-full h-full relative group">
              <img
                src={panel.img}
                alt={panel.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end text-white transition-opacity duration-300 ${activeIndex === i ? 'opacity-100' : 'opacity-70'}`}>
                <span className="text-xs font-bold uppercase tracking-widest text-white/80 mb-1">
                  NEXORA Real Estate
                </span>
                <h3 className="text-2xl font-black uppercase tracking-wide text-white mb-1">
                  {panel.title}
                </h3>
                {activeIndex === i && (
                  <p className="text-sm text-white/90 font-medium max-w-md animate-fade-in">
                    {panel.subtitle}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
