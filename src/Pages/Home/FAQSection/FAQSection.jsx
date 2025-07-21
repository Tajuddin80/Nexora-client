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
    <section
      data-aos="fade-right"
      className="
        my-12 p-6 md:p-10 
        bg-secondary/10 rounded-2xl shadow-xl 
        text-[color:var(--color-base-content)]
      "
    >
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 opacity-80 mx-auto max-w-2xl text-sm sm:text-base">
          Find answers to common questions about living in NEXORA, your trusted
          building management system.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="mx-auto space-y-4 ">
        {faqsToShow.map((faq, idx) => (
          <div
            key={idx}
            className={`
              collapse collapse-arrow rounded-xl border
              ${
                idx === 0 && !showAll
                  ? "bg-[color:var(--color-base-100)] border-primary/50"
                  : "bg-[color:var(--color-base-100)] border-[color:var(--color-base-content)]/10"
              }
              text-[color:var(--color-base-content)] shadow-sm hover:shadow-md transition
            `}
          >
            <input
              type="radio"
              name="faq-accordion"
              defaultChecked={idx === 0 && !showAll}
            />
            <div className="collapse-title text-left font-semibold text-base md:text-lg">
              {faq.question}
            </div>
            <div className="collapse-content text-left text-sm opacity-90">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="
            btn rounded-full px-6 py-3 flex items-center gap-2
            bg-[color:var(--color-primary)] text-[color:var(--color-primary-content)]
            hover:scale-105 transition-transform
          "
        >
          {showAll ? "Show Less" : "See More FAQ’s"}{" "}
          <FaArrowRight
            className="text-lg transition-transform"
            style={{ transform: showAll ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </div>
    </section>
  );
};

export default FAQSection;
