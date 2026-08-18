import React from "react";
import Banner from "./Banner/Banner";
import BuildingDetails from "./BuildingDetails/BuildingDetails";
import CouponsSection from "./CouponsSection/CouponsSection";
import LocationSection from "./LocationSection/LocationSection";
import MagicBentoWithImages from "../../Shared/component/MagicBentoWithImages/MagicBentoWithImages";
import FAQSection from "./FAQSection/FAQSection";
import TestimonialSlider from "./TestimonialSlider/TestimonialSlider";
import AmenitiesSection from "./AmenitiesSection/AmenitiesSection";
import HowItWorks from "./HowItWorks/HowItWorks";
import SignatureShowcase from "./SignatureShowcase/SignatureShowcase";

const Home = () => {
  return (
    <>
      <Banner />
      <CouponsSection />
      <SignatureShowcase />
      <AmenitiesSection />
      <MagicBentoWithImages />
      <BuildingDetails />
      <HowItWorks />
      <TestimonialSlider />
      <LocationSection />
      <FAQSection />
    </>
  );
};

export default Home;


