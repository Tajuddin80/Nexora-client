import React from "react";
import Banner from "./Banner/Banner";
import BuildingDetails from "./BuildingDetails/BuildingDetails";
import CouponsSection from "./CouponsSection/CouponsSection";
import LocationSection from "./LocationSection/LocationSection";
import MagicBentoWithImages from "../../Shared/component/MagicBentoWithImages/MagicBentoWithImages";
import FAQSection from "./FAQSection/FAQSection";
import TestimonialSlider from "./TestimonialSlider/TestimonialSlider";

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <CouponsSection></CouponsSection>
      <MagicBentoWithImages></MagicBentoWithImages>
      <BuildingDetails></BuildingDetails>
      <TestimonialSlider></TestimonialSlider>
      <LocationSection></LocationSection>
      <FAQSection></FAQSection>
    </>
  );
};

export default Home;
