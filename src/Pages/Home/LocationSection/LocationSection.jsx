import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const position = [23.8103, 90.4125];

const bangladeshBounds = [
  [20.0, 88.0],
  [27.5, 93.0],
];

const LocationSection = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-base-100 text-base-content border-b border-base-content/15">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-content/10">
          <FaMapMarkerAlt className="text-3xl text-base-content" />
          <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
            Location & Directions
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-base-content/80 mb-6 leading-relaxed font-medium">
          We are located in the heart of{" "}
          <span className="font-bold text-base-content">Dhaka, Bangladesh</span>,
          with quick access to major highways, shopping malls, and public
          transport. Use the interactive map below to easily find us.
        </p>

        {/* Map */}
        <div className="h-72 md:h-96 border-2 border-base-content overflow-hidden relative z-[50] shadow-xs">
          <MapContainer
            center={position}
            zoom={12}
            minZoom={6}
            maxBounds={bangladeshBounds}
            maxBoundsViscosity={1.0}
            className="h-full w-full"
            scrollWheelZoom={false}
            style={{ zIndex: 50 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={markerIcon}>
              <Popup>
                <strong>
                  <span className="text-black font-black uppercase">
                    NEXORA
                  </span>{" "}
                  Apartment Building
                </strong>{" "}
                <br />
                Easy to reach! <br />
                Call:{" "}
                <span className="text-black font-bold">
                  +8801845072525
                </span>{" "}
                <br />
                for more info.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
