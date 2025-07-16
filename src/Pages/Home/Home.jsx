import React from "react";
import Banner from "./Banner/Banner";
import Apartments from "./Apartments/Apartments";
import BuildingDetails from "./BuildingDetails/BuildingDetails";
import CouponsSection from "./CouponsSection/CouponsSection";
import LocationSection from "./LocationSection/LocationSection";
import MagicBentoWithImages from "../../Shared/component/MagicBentoWithImages/MagicBentoWithImages";

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <Apartments></Apartments>
      <CouponsSection></CouponsSection>
      <MagicBentoWithImages></MagicBentoWithImages>
      <BuildingDetails></BuildingDetails>
      <LocationSection></LocationSection>
    </>
  );
};

export default Home;
