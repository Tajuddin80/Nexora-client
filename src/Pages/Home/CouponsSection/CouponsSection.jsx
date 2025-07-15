// src/components/Home/CouponsSection.jsx
import React from "react";
import { FaGift } from "react-icons/fa";

const coupons = [
  { code: "WELCOME10", discount: "10% OFF", description: "On your first agreement" },
  { code: "FESTIVE20", discount: "20% OFF", description: "During festive seasons" },
  { code: "LOYAL5", discount: "5% OFF", description: "For loyal members" },
];

const CouponsSection = () => {
  return (
    <section className="my-12 p-6 md:p-10 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl text-white">
      <div className="flex items-center gap-3 mb-6">
        <FaGift className="text-4xl" />
        <h2 className="text-3xl md:text-4xl font-bold"> Special Coupons</h2>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coupons.map((c, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-white text-secondary shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-bold text-primary">{c.discount}</h3>
            <p className="text-sm mt-1">{c.description}</p>
            <div className="mt-4 p-2 border-dashed border-2 border-primary rounded-md text-center font-mono font-semibold text-primary bg-primary/5">
              {c.code}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CouponsSection;
