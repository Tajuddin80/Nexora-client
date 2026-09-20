import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const faqs = [
  {
    question: "How can I submit a maintenance request?",
    answer:
      "You can submit a maintenance request through our resident portal or by contacting the management office directly. We aim to respond promptly to all requests.",
  },
  {
    question: "What are the community rules and regulations?",
    answer:
      "Our community guidelines ensure a safe and pleasant living environment. You can find the full list of rules on the resident portal or in your welcome package.",
  },
  {
    question: "How is security handled in the building?",
    answer:
      "We have 24/7 security personnel, surveillance cameras in common areas, and secure entry systems to ensure your safety at all times.",
  },
  {
    question: "Are pets allowed in the apartments?",
    answer:
      "Yes, pets are allowed in certain apartments with prior approval and following the community’s pet policies to ensure a comfortable environment for all residents.",
  },
  {
    question: "How do I pay my rent and other fees?",
    answer:
      "Rent and other fees can be paid online via the resident portal, or in person at the management office during business hours.",
  },
  {
    question: "What amenities are available to residents?",
    answer:
      "Residents can enjoy amenities like a fitness center, swimming pool, community lounge, and rooftop garden. Access details are available in the resident portal.",
  },
];

const FAQSection = () => {
  const [showAll, setShowAll] = useState(false);

  const faqsToShow = showAll ? faqs : faqs.slice(0, 3);

  return (
    <section className="w-full py-12 md:py-20 bg-base-200/30 text-base-content border-b border-base-content/15">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
            Common Questions
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-base-content/75 max-w-2xl mx-auto leading-relaxed font-medium">
            Find answers to common questions about living in NEXORA, your trusted
            building management system.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="w-full space-y-3">
          {faqsToShow.map((faq, idx) => (
            <div
              key={idx}
              className="collapse collapse-arrow rounded-none border border-base-content/15 bg-base-100 text-base-content shadow-xs hover:border-base-content transition-all"
            >
              <input
                type="radio"
                name="faq-accordion-home"
                defaultChecked={idx === 0 && !showAll}
              />
              <div className="collapse-title text-left font-bold text-sm sm:text-base text-base-content uppercase tracking-wide">
                {faq.question}
              </div>
              <div className="collapse-content text-left text-sm text-base-content/80 leading-relaxed font-medium">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="btn rounded-none bg-base-content text-base-100 hover:bg-base-content/80 px-6 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-none"
          >
            {showAll ? "Show Less" : "See More FAQ’s"}{" "}
            <FaArrowRight
              className="text-xs transition-transform"
              style={{ transform: showAll ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
