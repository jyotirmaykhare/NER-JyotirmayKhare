"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { GoogleMapPlace } from "@/lib/googleMapsApi";
import {
  Coffee,
  Fuel,
  Hospital,
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  ArrowRight,
  X,
  ExternalLink,
  Navigation,
} from "lucide-react";

interface GoogleMapsPlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function GoogleMapsPlacesModal({
  isOpen,
  onClose,
  initialQuery = "Coffee",
}: GoogleMapsPlacesModalProps) {
  const { focusOnLocation, setActiveTab, showNotification } = useApp();

  const [query, setQuery] = useState(initialQuery);
  const [places, setPlaces] = useState<GoogleMapPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<GoogleMapPlace | null>(null);
  const [error, setError] = useState("");

  const categories = [
    { label: "Coffee & Diner", query: "Coffee", icon: Coffee },
    { label: "Fuel & Diesel", query: "Fuel", icon: Fuel },
    { label: "Emergency Hospital", query: "Hospital", icon: Hospital },
  ];

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: searchQuery, lat: "26.2", lng: "92.9" });
      const response = await fetch(`/api/places?${params}`);
      const payload = (await response.json()) as { places?: GoogleMapPlace[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Google Maps Places is unavailable.");
      setPlaces(payload.places || []);
    } catch (cause) {
      setPlaces([]);
      setError(cause instanceof Error ? cause.message : "Google Maps Places is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const searchTask = window.setTimeout(() => {
      void handleSearch(query);
    }, 0);

    return () => window.clearTimeout(searchTask);
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlotOnMap = (place: GoogleMapPlace) => {
    focusOnLocation(
      place.gpsCoordinates.latitude,
      place.gpsCoordinates.longitude,
      12,
      place.title
    );
    setActiveTab("map");
    onClose();
    showNotification(
      "Checkpoint Pinned",
      `Targeted ${place.title} on GIS Navigation Map.`,
      "success"
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Google Maps Nearby Amenities</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-slate-800 text-emerald-400 rounded border border-slate-700">
                  Live Places
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Live results from Google Maps Places near the selected NER corridor
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Category Buttons + Search Input */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/30">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = query.toLowerCase().includes(cat.query.toLowerCase());
              return (
                <button
                  key={cat.query}
                  onClick={() => {
                    setQuery(cat.query);
                    handleSearch(cat.query);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Coffee, Fuel, Food, Hospital along highway..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-24 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Places List (Ultra user-friendly card layout) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {error && <div className="p-3 rounded-lg border border-amber-700/60 bg-amber-950/30 text-xs text-amber-100">{error}</div>}
          {places.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No amenities found for &ldquo;{query}&rdquo;. Try searching &ldquo;Coffee&rdquo; or &ldquo;Fuel&rdquo;.
            </div>
          )}

          {places.map((place) => (
            <div
              key={place.title}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white truncate">{place.title}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {place.type}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{place.address}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1 text-slate-300">
                  {place.rating && (
                    <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{place.rating}</span>
                      {place.reviews && (
                        <span className="text-slate-500 font-normal">({place.reviews})</span>
                      )}
                    </span>
                  )}

                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{place.openState}</span>
                  </span>

                  {place.phone && (
                    <span className="flex items-center gap-1 text-slate-400 font-mono">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{place.phone}</span>
                    </span>
                  )}

                  {place.distanceKm && (
                    <span className="text-sky-400 font-mono font-semibold">
                      • {place.distanceKm} km off corridor
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <button
                  onClick={() => handlePlotOnMap(place)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-950/40"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Pin on GIS Map</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-500">
          <span>Live results supplied by Google Maps Places</span>
          <span className="font-mono">Lat: 26.2°N • Lng: 92.9°E</span>
        </div>
      </div>
    </div>
  );
}
