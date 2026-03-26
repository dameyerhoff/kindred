"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";

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

function GeocodeMarker({ mission, index, onClick }) {
  const [position, setPosition] = useState(null);
  const locationSearch = mission.profiles?.city;

  useEffect(() => {
    if (!locationSearch || !window.google) return;

    const timer = setTimeout(() => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        {
          address: locationSearch,
          componentRestrictions: { country: "GB" },
        },
        (results, status) => {
          if (status === "OK" && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            const jitterLat = (Math.random() - 0.5) * 0.02;
            const jitterLng = (Math.random() - 0.5) * 0.02;

            setPosition({
              lat: lat() + jitterLat,
              lng: lng() + jitterLng,
            });
          }
        },
      );
    }, index * 150);

    return () => clearTimeout(timer);
  }, [locationSearch, index]);

  if (!position) return null;

  return (
    <MarkerF
      position={position}
      onClick={() => onClick({ ...mission, position })}
      icon={{
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
        fillColor: "#a3e635",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
        scale: 1.5,
      }}
    />
  );
}

export default function FavourMapClient({ openMissions = [], apiKey, userId }) {
  const [mounted, setMounted] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  // FIXED: Dynamic wrapper for claim action
  const handleClaim = async (formData) => {
    const { claimFavour } = await import("../actions");
    await claimFavour(formData);
  };

  const filteredMissions = openMissions.filter((mission) => {
    const search = searchTerm.toLowerCase();
    const inText = mission.favour_text?.toLowerCase().includes(search) || false;
    const inCategory =
      mission.category?.toLowerCase().includes(search) || false;
    const inCity =
      mission.profiles?.city?.toLowerCase().includes(search) || false;
    return inText || inCategory || inCity;
  });

  if (!isLoaded || !mounted)
    return (
      <div className="h-[85vh] w-full flex items-center justify-center bg-white/5 rounded-[2.5rem] border border-white/10">
        <div className="text-lime-400 animate-pulse font-black uppercase tracking-[0.4em] text-xs">
          Syncing Kindred Grid... 🌐
        </div>
      </div>
    );

  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-10 bg-black group">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search the Grid (Category, City, Need)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/80 backdrop-blur-md border border-kindred-lime/30 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-kindred-lime placeholder:text-kindred-lime/30 focus:outline-none focus:border-kindred-lime transition-all shadow-2xl"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-kindred-lime/50">
            {filteredMissions.length} FOUND
          </div>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        options={mapOptions}
      >
        {filteredMissions.map((mission, index) => (
          <GeocodeMarker
            key={mission.id || index}
            mission={mission}
            index={index}
            onClick={(m) => setSelectedMission(m)}
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

                {userId && userId !== selectedMission.sender_id ? (
                  <form action={handleClaim}>
                    <input
                      type="hidden"
                      name="favourId"
                      value={selectedMission.id}
                    />
                    <button
                      type="submit"
                      className="text-[8px] bg-green-900 text-white px-3 py-1.5 rounded font-black uppercase tracking-widest hover:bg-lime-600 transition-all shadow-md"
                    >
                      Claim 🤝
                    </button>
                  </form>
                ) : (
                  <span className="text-[8px] font-black text-gray-400 uppercase">
                    Your Post
                  </span>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
