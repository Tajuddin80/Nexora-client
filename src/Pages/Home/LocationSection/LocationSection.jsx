// src/components/Home/LocationSection.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//  Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

//  Gulshan, Dhaka coordinates
const position = [23.8103, 90.4125];

//  Bounds for Bangladesh (rough bounding box)
const bangladeshBounds = [
  [20.0, 88.0], // Southwest corner
  [27.5, 93.0], // Northeast corner
];

const LocationSection = () => {
  return (
    <section className="my-12 p-6 md:p-10 bg-secondary/10 rounded-2xl shadow-xl">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <FaMapMarkerAlt className="text-4xl text-secondary" />
        <h2 className="text-3xl md:text-4xl font-bold text-secondary">
          Location & Directions
        </h2>
      </div>

      {/* Description */}
      <p className="text-base md:text-lg text-secondary mb-6">
        We are located in the heart of{" "}
        <span className="font-bold text-secondary">Dhaka, Bangladesh</span>,
        with quick access to major highways, shopping malls, and public
        transport. Use the map below to easily find us.
      </p>

      {/* Map */}
      <div className="h-72 md:h-96 rounded-xl overflow-hidden border-4 border-primary shadow-inner relative z-[50]">
        <MapContainer
          center={position}
          zoom={12}
          minZoom={6}
          maxBounds={bangladeshBounds}
          maxBoundsViscosity={1.0}
          className="h-full w-full"
          scrollWheelZoom={false}
          style={{ zIndex: 50 }} // inline style also works
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={markerIcon}>
            <Popup>
              <strong>
                <span className="text-primary">
                  <strong>NEXORA</strong>
                </span>{" "}
                Apartment Building
              </strong>{" "}
              <br />
              Easy to reach! <br />
              Call:{" "}
              <span className="text-primary font-semibold">
                +8801845072525
              </span>{" "}
              <br />
              for more info.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};

export default LocationSection;
