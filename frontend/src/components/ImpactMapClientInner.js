"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ImpactMapClientInner = ({ demo }) => {
  const [geoData, setGeoData] = useState([]);

  useEffect(() => {
    if (demo) {
      const dataArray = Array.isArray(demo)
        ? demo
        : Object.entries(demo).map(([key, value]) => value);

      const transformed = dataArray.map((item) => ({
        schoolName: item.schoolName,
        count: item.count,
        latitude: item.latitude,
        longitude: item.longitude,
        city: item.city,
        zip: item.zip,
      }));
      setGeoData(transformed);
    }
  }, [demo]);

  if (!geoData.length) return <div>Loading Map...</div>;

  const center = [
    geoData.reduce((sum, s) => sum + s.latitude, 0) / geoData.length,
    geoData.reduce((sum, s) => sum + s.longitude, 0) / geoData.length,
  ];

  return (
    <MapContainer
      center={center}
      zoom={9}
      style={{ height: "600px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />

      {geoData.map((school, idx) => (
        <Circle
          key={idx}
          center={[school.latitude, school.longitude]}
          radius={school.count * 20 + 700}
          pathOptions={{ color: "purple", fillColor: "purple", fillOpacity: 0.5 }}
        >
          <Popup>
            <strong>{school.schoolName}</strong>
            <br />
            {school.city}, {school.zip}
            <br />
            Submissions: {school.count}
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
};

export default ImpactMapClientInner;
