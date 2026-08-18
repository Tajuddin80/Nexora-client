import React, { useState } from "react";
import { Link } from "react-router";
import { FaQuestionCircle, FaArrowRight, FaComments } from "react-icons/fa";

const faqs = [
  {
    q: "What is required to apply for an apartment?",
    a: "You can apply directly from the apartment listings page. You will need basic personal details and standard verification documents. Admin reviews agreements within 24 hours.",
  },
  {
    q: "How does the rental payment work?",
    a: "Once your agreement request is approved, your apartment status changes to 'accepted'. You can then pay rent online via Stripe directly from your Resident Dashboard.",
  },
  {
    q: "Can I use coupon codes for rent discount?",
    a: "Yes! Active coupon codes listed on the homepage can be applied during checkout to get instant discounts on your monthly rent.",
  },
  {
    q: "Is there a security deposit required?",
    a: "Deposit terms are specified per apartment listing. All payments and deposit records are securely tracked in your digital portal.",
  },
];

const LeasingFAQCTA = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="my-10 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* FAQ Accordion Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-base-content/20">
            <FaQuestionCircle className="text-2xl text-base-content" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block">
                Leasing Help
              </span>
              <h2 className="text-xl md:text-2xl font-black text-base-content uppercase tracking-wide">
                Apartment Booking FAQ
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="border border-base-content/20 bg-base-100 transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-base-content uppercase tracking-wide flex justify-between items-center gap-2 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className="text-base font-bold">{openIdx === idx ? "−" : "+"}</span>
                </button>
                {openIdx === idx && (
                  <div className="px-4 pb-4 border-t border-base-content/10 text-xs md:text-sm text-base-content/80 font-medium leading-relaxed pt-2">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card Column - Theme-aware non-glaring box */}
        <div className="lg:col-span-5 p-8 bg-base-100 border border-base-content/30 shadow-xs flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-2">
              Have Questions?
            </span>
            <h3 className="text-2xl font-black uppercase tracking-wide text-base-content mb-3">
              Need Direct Assistance?
            </h3>
            <p className="text-sm text-base-content/80 leading-relaxed font-medium mb-6">
              Our administration office is online 24/7 to answer your apartment queries, schedule video tours, or guide your application.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-base-content/15">
            <Link
              to="/dashboard/chat"
              className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none w-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-none"
            >
              <FaComments className="text-sm" /> Chat With Building Admin
            </Link>
            <Link
              to="/about"
              className="btn border border-base-content bg-transparent text-base-content hover:bg-base-content/10 rounded-none w-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Learn Building Policies <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeasingFAQCTA;
