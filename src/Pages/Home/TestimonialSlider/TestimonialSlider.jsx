import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const fallbackReviews = [
  {
    review: "Living at NEXORA has been an extraordinary experience. The keyless digital access, quiet soundproof rooms, and 24/7 security make it the best residence in the city.",
    userName: "Alex Rivera",
    ratings: 5,
    user_photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    review: "The administrative response time is super fast. Agreement submission took less than 5 minutes online, and moving in was completely stress-free.",
    userName: "Sarah Jenkins",
    ratings: 5,
    user_photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];

const TestimonialSlider = () => {
  const loaderReviews = useLoaderData();
  const reviews = (loaderReviews && loaderReviews.length > 0) ? loaderReviews : fallbackReviews;
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const currentReview = reviews[current] || fallbackReviews[0];

  return (
    <section className="my-12 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/20 shadow-xs">
      {/* Heading */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
          Resident Feedback
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
          What Our Residents Say
        </h2>
        <p className="mt-2 text-sm text-base-content/75 w-full leading-relaxed font-medium">
          Real feedback from customers who have experienced living at NEXORA.
        </p>
      </div>

      {/* Testimonial Card */}
      <div className="w-full p-6 md:p-10 bg-base-100 border border-base-content/15 shadow-xs text-left relative">
        <FaQuoteLeft className="text-3xl text-base-content mb-4 opacity-30" />
        <p className="text-base md:text-lg text-base-content font-medium leading-relaxed mb-6">
          “{currentReview.review}”
        </p>
        <div className="border-t border-base-content/10 pt-4 flex items-center gap-4">
          <img
            src={currentReview.user_photoURL || fallbackReviews[0].user_photoURL}
            alt={currentReview.userName}
            className="w-12 h-12 rounded-full object-cover border border-base-content/30"
          />
          <div>
            <h4 className="text-base-content font-bold uppercase tracking-wide text-sm">
              {currentReview.userName}
            </h4>
            <p className="text-xs text-base-content/70 font-semibold mt-0.5">
              Rating: {currentReview.ratings || 5} ★
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prevSlide}
          className="btn btn-square rounded-none bg-base-content text-base-100 hover:bg-base-content/80 border-none text-sm"
          title="Previous Review"
        >
          <FaChevronLeft />
        </button>
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`w-2.5 h-2.5 transition-all ${
              index === current
                ? "bg-base-content scale-125"
                : "bg-base-content/20"
            }`}
          ></span>
        ))}
        <button
          onClick={nextSlide}
          className="btn btn-square rounded-none bg-base-content text-base-100 hover:bg-base-content/80 border-none text-sm"
          title="Next Review"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default TestimonialSlider;
