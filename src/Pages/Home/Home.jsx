import React from "react";
import Banner from "./Banner/Banner";
import BuildingDetails from "./BuildingDetails/BuildingDetails";
import CouponsSection from "./CouponsSection/CouponsSection";
import LocationSection from "./LocationSection/LocationSection";
import MagicBentoWithImages from "../../Shared/component/MagicBentoWithImages/MagicBentoWithImages";
import FAQSection from "./FAQSection/FAQSection";
import AmenitiesSection from "./AmenitiesSection/AmenitiesSection";
import HowItWorks from "./HowItWorks/HowItWorks";
import SignatureShowcase from "./SignatureShowcase/SignatureShowcase";
import ResidentTestimonials from "./ResidentTestimonials/ResidentTestimonials";
import NeighborhoodHighlights from "./NeighborhoodHighlights/NeighborhoodHighlights";

const Home = () => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      <Banner />
      <CouponsSection />
      <SignatureShowcase />
      <AmenitiesSection />
      <MagicBentoWithImages />
      <BuildingDetails />
      <NeighborhoodHighlights />
      <HowItWorks />
      <ResidentTestimonials />
      <LocationSection />
      <FAQSection />
    </div>
  );
};

export default Home;
