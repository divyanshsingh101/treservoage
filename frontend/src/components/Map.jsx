import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon to fix default Leaflet icon issue
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ onSelectLocation }) => {
  useMapEvents({
    click: (e) => {
      onSelectLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapComponent = ({
  initialViewState = { longitude: -122.4, latitude: 37.8, zoom: 12 },
  onSelectLocation,
  markerPosition,
}) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={[initialViewState.latitude, initialViewState.longitude]}
        zoom={initialViewState.zoom}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Handle clicks for selecting a location */}
        <LocationMarker onSelectLocation={onSelectLocation} />

        {/* Show marker if a location is selected */}
        {markerPosition && (
          <Marker position={markerPosition} icon={customIcon} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
