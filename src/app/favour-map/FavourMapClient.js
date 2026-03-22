"use client";

import { useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Link from "next/link";

// Dave: Expanded height to fill the screen properly
const containerStyle = {
  width: "100%",
  height: "85vh",
};

const center = {
  lat: 54.5,
  lng: -2.5,
};

const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#061a06" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#061a06" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#1a3a1a" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#a3e635" }],
    },
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

export default function FavourMapClient({ openMissions = [], apiKey }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const [selectedMission, setSelectedMission] = useState(null);

  // Dave: Logic to turn Supabase data into visible pins
  const missionsWithPositions = useMemo(() => {
    if (!openMissions || openMissions.length === 0) return [];

    return openMissions.map((mission) => {
      // Dave: We use the mission ID as a seed so the marker stays in the same place on refresh
      const seed = mission.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const pseudoRandom = (offset) => (Math.sin(seed + offset) * 10000) % 1;

      return {
        ...mission,
        position: {
          // Spread them across the UK based on the seed
          lat: 51.5 + pseudoRandom(1) * 4,
          lng: -0.1 + pseudoRandom(2) * 3,
        },
      };
    });
  }, [openMissions]);

  if (!isLoaded || !mounted)
    return (
      <div className="h-[85vh] w-full flex items-center justify-center bg-white/5 rounded-[2.5rem] border border-white/10">
        <div className="text-lime-400 animate-pulse font-black uppercase tracking-[0.4em] text-xs">
          Syncing Kindred Grid... 🌐
        </div>
      </div>
    );

  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-10 bg-black">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        options={mapOptions}
      >
        {missionsWithPositions.map((mission) => (
          <Marker
            key={mission.id}
            position={mission.position}
            onClick={() => setSelectedMission(mission)}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
              fillColor: "#a3e635",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
              scale: 1.5,
            }}
          />
        ))}

        {selectedMission && (
          <InfoWindow
            position={selectedMission.position}
            onCloseClick={() => setSelectedMission(null)}
          >
            <div className="p-2 text-green-950 min-w-[180px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[8px] bg-green-100 px-2 py-0.5 rounded-full font-black uppercase">
                  {selectedMission.category || "Favour"}
                </span>
              </div>
              <p className="text-xs font-bold leading-tight mb-3">
                &ldquo;{selectedMission.favour_text}&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-[9px] font-black uppercase">
                  {selectedMission.profiles?.full_name?.split(" ")[0]}
                </span>
                <Link
                  href="/notice-board"
                  className="text-[8px] bg-green-900 text-white px-2 py-1 rounded font-black uppercase tracking-tighter"
                >
                  Details →
                </Link>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
