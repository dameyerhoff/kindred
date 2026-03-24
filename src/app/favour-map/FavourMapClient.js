"use client";

import { useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Link from "next/link";

// This sets how big the map looks on your screen
const containerStyle = {
  width: "100%",
  height: "85vh",
};

// This tells the map to start looking at the middle of the UK
const center = {
  lat: 54.5,
  lng: -2.5,
};

// These are the rules for how the map looks, like using dark green colors
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

// This is the main part that builds the interactive map
export default function FavourMapClient({ openMissions = [], apiKey }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This talks to Google to get the map ready to show
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const [selectedMission, setSelectedMission] = useState(null);

  // This part takes the list of favours and gives them a spot on the map
  const missionsWithPositions = useMemo(() => {
    if (!openMissions || openMissions.length === 0) return [];

    return openMissions.map((mission) => {
      // This uses a clever trick to make sure each favour stays in the same place
      const seed = mission.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const pseudoRandom = (offset) => (Math.sin(seed + offset) * 10000) % 1;

      return {
        ...mission,
        position: {
          // This spreads the pins out across different parts of the country
          lat: 51.5 + pseudoRandom(1) * 4,
          lng: -0.1 + pseudoRandom(2) * 3,
        },
      };
    });
  }, [openMissions]);

  // If the map is still warming up, show a loading message
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
      {/* This is the actual Google Map being drawn */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        options={mapOptions}
      >
        {/* This loops through all the favours and puts a pin on the map for each one */}
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

        {/* If you click a pin, this shows a little bubble with information about the favour */}
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
                {/* This button takes you to the notice board to see more details */}
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
