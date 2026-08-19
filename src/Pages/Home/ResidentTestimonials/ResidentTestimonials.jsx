import React from "react";
import { FaStar, FaQuoteLeft, FaCheckCircle, FaUserCheck } from "react-icons/fa";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Resident • Apt A-402",
    period: "Tenant for 2 Years",
    rating: 5,
    comment:
      "Moving into NEXORA was seamless. Applying online took less than 10 minutes and the keyless entrance tech is incredible. Maintenance tickets are resolved within hours!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Dr. Elena Rostova",
    role: "Resident • Penthouse 12B",
    period: "Tenant for 1.5 Years",
    rating: 5,
    comment:
      "The acoustic soundproof glass makes working from home completely silent despite being in the heart of downtown. The rooftop lounge views are unmatched.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Marcus Vance",
    role: "Resident • Apt B-204",
    period: "Tenant for 8 Months",
    rating: 5,
    comment:
      "Paying rent online via Stripe directly on my resident portal with auto-applied coupon discounts saved me hundreds. Best residential experience in the city.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

const ResidentTestimonials = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-base-200/40 text-base-content border-b border-base-content/15">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-4 border-b border-base-content/15">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
              Verified Community Feedback
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
              Resident Experiences
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-base-content/10 text-base-content text-xs font-black uppercase tracking-wider border border-base-content/20">
            <FaUserCheck className="text-sm text-base-content" /> 100% Verified Leases
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-base-content text-sm">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} className="text-base-content" />
                    ))}
                  </div>
                  <FaQuoteLeft className="text-base-content/20 text-2xl" />
                </div>

                <p className="text-sm text-base-content/85 leading-relaxed font-medium mb-6 italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-base-content/15 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 object-cover border border-base-content/30 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-black text-base-content uppercase tracking-wide flex items-center gap-1.5">
                    {item.name} <FaCheckCircle className="text-base-content/60 text-xs" />
                  </h4>
                  <p className="text-[11px] font-bold text-base-content/70 uppercase tracking-wider">
                    {item.role} • {item.period}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResidentTestimonials;
