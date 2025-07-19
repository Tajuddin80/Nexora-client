import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TestimonialSlider = () => {
  const reviews = useLoaderData();
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const currentReview = reviews[current];

  return (
    <section
      className="
        my-12 p-6 md:p-10 
        bg-secondary/10 rounded-2xl shadow-xl
        text-[color:var(--color-base-content)]
      "
    >
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary">
          What our customers are saying
        </h2>
        <p className="mt-3 text-sm md:text-base opacity-80 max-w-2xl mx-auto">
          Real feedback from customers who have experienced our services!
        </p>
      </div>

      {/* Testimonial Card */}
      <div
        className="
          max-w-4xl mx-auto p-6 md:p-10 
          bg-[color:var(--color-base-100)] rounded-xl shadow-md 
          text-left relative
        "
      >
        <FaQuoteLeft className="text-4xl text-primary mb-4" />
        <p className="text-base md:text-lg opacity-90 mb-6 leading-relaxed">
          “{currentReview.review}”
        </p>
        <div className="border-t border-dashed border-primary/40 pt-4 flex items-center gap-4">
          <img
            src={currentReview.user_photoURL}
            alt={currentReview.userName}
            className="w-12 h-12 rounded-full object-cover border border-primary/50"
          />
          <div>
            <h4 className="text-primary font-semibold">
              {currentReview.userName}
            </h4>
            <p className="text-sm opacity-70">
              Rating: {currentReview.ratings} ★
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prevSlide}
          className="
            btn btn-circle 
            bg-[color:var(--color-primary)] text-[color:var(--color-primary-content)]
            hover:scale-105 transition-transform
          "
        >
          <FaChevronLeft />
        </button>
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current
                ? "bg-[color:var(--color-primary)]"
                : "bg-[color:var(--color-base-content)]/30"
            }`}
          ></span>
        ))}
        <button
          onClick={nextSlide}
          className="
            btn btn-circle 
            bg-[color:var(--color-primary)] text-[color:var(--color-primary-content)]
            hover:scale-105 transition-transform
          "
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default TestimonialSlider;
