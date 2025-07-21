
import React from "react";
import { FaBuilding, FaCheckCircle } from "react-icons/fa";

const BuildingDetails = () => {
  return (
    <section className="my-12 p-6 md:p-10 rounded-2xl shadow-xl bg-secondary/10">
      <div className="flex items-center gap-3 mb-6">
        <FaBuilding className="text-4xl text-secondary" />
        <h2 className="text-3xl md:text-4xl font-bold text-secondary">
          About the Building
        </h2>
      </div>
      <p className="text-base md:text-lg leading-relaxed text-secondary mb-6">
        Our building is a masterpiece of modern architecture, designed to bring
        you comfort, security, and luxury living. Enjoy spacious apartments,
        high-speed elevators, 24/7 surveillance, and eco-friendly energy
        systems. Residents can also relax in rooftop gardens, work out in a
        fully equipped gym, and spend quality time in our community spaces.
      </p>
      <ul className="space-y-3">
        <li className="flex items-center gap-3 text-secondary">
          <FaCheckCircle className="text-secondary text-xl" /> 24/7 Security
          with CCTV
        </li>
        <li className="flex items-center gap-3 text-secondary">
          <FaCheckCircle className="text-secondary text-xl" /> High-Speed
          Elevators
        </li>
        <li className="flex items-center gap-3 text-secondary">
          <FaCheckCircle className="text-secondary text-xl" /> Rooftop Garden &
          Gym
        </li>
      </ul>
    </section>
  );
};

export default BuildingDetails;
