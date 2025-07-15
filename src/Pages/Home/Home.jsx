import React from "react";
import Banner from "./Banner/Banner";
import Apartments from "./Apartments/Apartments";
import BuildingDetails from "./BuildingDetails/BuildingDetails";
import CouponsSection from "./CouponsSection/CouponsSection";
import LocationSection from "./LocationSection/LocationSection";

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <Apartments></Apartments>
      <BuildingDetails></BuildingDetails>
      <CouponsSection></CouponsSection>
      <LocationSection></LocationSection>
    </>
  );
};

export default Home;
