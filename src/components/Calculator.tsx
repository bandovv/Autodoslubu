import { useMemo, useState, useEffect, type ChangeEvent } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { Route, Clock, ChevronRight, Plus, Trash2 } from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";

import "leaflet/dist/leaflet.css";

interface LatLng {
  lat: number;
  lng: number;
}

const NOMINATIM_DELAY_MS = 1100;

async function geocodeAddress(query: string): Promise<LatLng | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`;
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "pl,en;q=0.9",
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { lat?: string; lon?: string }[];
  if (!Array.isArray(data) || data.length === 0 || !data[0].lat || !data[0].lon) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

async function geocodeSequence(addresses: string[]): Promise<LatLng[]> {
  const out: LatLng[] = [];
  for (let i = 0; i < addresses.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, NOMINATIM_DELAY_MS));
    const pt = await geocodeAddress(addresses[i]);
    if (!pt) throw new Error(addresses[i]);
    out.push(pt);
  }
  return out;
}

async function routeOsrm(points: LatLng[]): Promise<{ distanceKm: number; coords: [number, number][] } | null> {
  if (points.length < 2) return null;
  const path = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson`
  );
  const data = await res.json();
  if (!data.routes?.length) return null;
  const route = data.routes[0];
  const distKm = route.distance / 1000;
  const coords: [number, number][] = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
  return { distanceKm: Math.round(distKm), coords };
}

type CalculatorProps = {
  onOpenBooking: () => void;
};

function FitRoute({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, positions]);
  return null;
}

export default function Calculator({ onOpenBooking }: CalculatorProps) {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [stops, setStops] = useState<string[]>([""]);
  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationHours, setDurationHours] = useState<number>(5);
  const [manualDistance, setManualDistance] = useState<string>("");
  const [routeError, setRouteError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const BASE_PRICE = 2390;
  const BASE_KM = 100;
  const BASE_HOURS = 5;
  const EXTRA_KM_PRICE = 10;
  const EXTRA_HOUR_PRICE = 200;

  const mapCenter = useMemo(() => ({ lat: 53.1325, lng: 23.1688 }), []);

  const calculateRoute = async () => {
    if (!startAddress.trim() || !endAddress.trim()) {
      setRouteError("Podaj adres startowy i docelowy.");
      return;
    }

    setIsCalculating(true);
    setRouteError("");

    const middle = stops.map((s) => s.trim()).filter(Boolean);
    const sequence = [startAddress.trim(), ...middle, endAddress.trim()];

    try {
      const points = await geocodeSequence(sequence);
      const routed = await routeOsrm(points);
      if (!routed) {
        setRouteError("Nie udało się wyznaczyć trasy między punktami.");
        return;
      }
      setRouteLine(routed.coords);
      setDistanceKm(routed.distanceKm);
      setManualDistance(String(routed.distanceKm));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setRouteError(
        `Nie znaleziono adresu lub błąd sieci: ${msg || "spróbuj doprecyzować adres (miasto, ulica)."}.`
      );
      setRouteLine([]);
    } finally {
      setIsCalculating(false);
    }
  };

  const updateStop = (index: number, value: string) => {
    setStops((prev) => prev.map((stop, i) => (i === index ? value : stop)));
  };

  const addStop = () => {
    setStops((prev) => [...prev, ""]);
  };

  const removeStop = (index: number) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  const resetRoute = () => {
    setRouteLine([]);
    setRouteError("");
    setDistanceKm(parseInt(manualDistance, 10) || 0);
  };

  const handleManualDistChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualDistance(val);
    const parsed = parseInt(val, 10);
    setDistanceKm(Number.isNaN(parsed) ? 0 : parsed);
    if (val !== "") {
      setRouteLine([]);
    }
  };

  const calculateTotal = () => {
    const extraKm = Math.max(0, distanceKm - BASE_KM);
    const extraHours = Math.max(0, durationHours - BASE_HOURS);

    return BASE_PRICE + extraKm * EXTRA_KM_PRICE + extraHours * EXTRA_HOUR_PRICE;
  };

  return (
    <section id="kalkulator" className="py-24 bg-[#FDF9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#C2185B] text-[11px] font-bold uppercase tracking-widest mb-3">Wycena Przejazdu</h2>
          <h3 className="text-4xl md:text-5xl border-b-0 font-serif text-slate-900 italic mb-6">Wycena Wynajmu</h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Wpisz start, przystanki pośrednie i cel, wybierz adres z listy lub dopisz ręcznie, następnie wyznacz trasę.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-pink-900/5 border border-pink-50">
          <div className="lg:col-span-3 rounded-2xl border border-pink-100 bg-[#FDF9FB] p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <AddressAutocomplete
                value={startAddress}
                onChange={setStartAddress}
                placeholder="Start (np. Lipowa 3, Białystok)"
              />

              {stops.map((stop, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <AddressAutocomplete
                      value={stop}
                      onChange={(v) => updateStop(idx, v)}
                      placeholder={`Przystanek ${idx + 1} (opcjonalnie)`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStop(idx)}
                    className="px-3 rounded-lg border border-pink-100 text-slate-600 hover:bg-pink-50 transition-colors"
                    aria-label={`Usuń przystanek ${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addStop}
                className="w-fit inline-flex items-center px-3 py-2 rounded-lg border border-pink-100 text-[#C2185B] text-xs font-bold uppercase tracking-wider hover:bg-pink-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj przystanek
              </button>

              <AddressAutocomplete
                value={endAddress}
                onChange={setEndAddress}
                placeholder="Cel (np. Rynek Kościuszki, Białystok)"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={calculateRoute}
                  disabled={isCalculating}
                  className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest py-3 px-5 rounded-lg hover:bg-black transition-all disabled:opacity-60"
                >
                  {isCalculating ? "Wyznaczanie..." : "Wyznacz trasę"}
                </button>
                <button
                  type="button"
                  onClick={resetRoute}
                  className="bg-white text-slate-700 text-[11px] font-bold uppercase tracking-widest py-3 px-5 rounded-lg border border-pink-100 hover:bg-pink-50 transition-all"
                >
                  Wyczyść trasę
                </button>
              </div>
              {routeError && <p className="text-xs text-red-600">{routeError}</p>}
            </div>

            <div className="h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-pink-100 z-0 relative">
              <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={11} className="h-full w-full" scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {routeLine.length > 0 && <FitRoute positions={routeLine} />}
                {routeLine.length > 0 && <Polyline positions={routeLine} color="#db2777" weight={4} />}
              </MapContainer>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">
                  <Route className="w-4 h-4 mr-2 text-[#C2185B]" />
                  Całkowity dystans (km)
                </label>
                <input
                  type="number"
                  min="0"
                  value={manualDistance}
                  onChange={handleManualDistChange}
                  className="w-full px-4 py-3 rounded-lg border border-pink-100 bg-[#FCE4EC]/30 text-xs focus:bg-white outline-none focus:ring-1 focus:ring-pink-400 transition-all text-slate-800 font-mono font-bold"
                  placeholder="np. 150"
                />
                <p className="text-[10px] text-slate-400 mt-2 tracking-wide uppercase">Dystans powyżej 100 km: +10 PLN / km</p>
              </div>

              <div>
                <label className="flex items-center text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">
                  <Clock className="w-4 h-4 mr-2 text-[#C2185B]" />
                  Czas wynajmu (godziny)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-[#C2185B] hover:accent-[#AD1457]"
                  />
                  <span className="w-12 text-center font-bold text-lg text-slate-900">{durationHours}h</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 tracking-wide uppercase">Czas powyżej 5h: +200 PLN / h</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="bg-[#AD1457] rounded-xl p-6 border-0 text-white shadow-lg shadow-pink-900/10">
                <div className="text-[10px] font-bold uppercase opacity-70 tracking-[0.2em] mb-1">Szacowany Koszt</div>
                <div className="text-4xl md:text-5xl font-serif text-white mb-4">
                  {calculateTotal().toLocaleString("pl-PL")}{" "}
                  <span className="text-[10px] font-sans opacity-70 uppercase tracking-widest">PLN</span>
                </div>

                <ul className="text-xs text-white/90 font-mono space-y-2 mb-6 opacity-80">
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-pink-300 mr-2" /> Baza (do 100km, 5h): {BASE_PRICE} PLN
                  </li>
                  {distanceKm > BASE_KM && (
                    <li className="flex items-center">
                      <ChevronRight className="w-4 h-4 text-pink-300 mr-2" /> Dodatkowe {distanceKm - BASE_KM} km:{" "}
                      {(distanceKm - BASE_KM) * EXTRA_KM_PRICE} PLN
                    </li>
                  )}
                  {durationHours > BASE_HOURS && (
                    <li className="flex items-center">
                      <ChevronRight className="w-4 h-4 text-pink-300 mr-2" /> Dodatkowe {durationHours - BASE_HOURS} h:{" "}
                      {(durationHours - BASE_HOURS) * EXTRA_HOUR_PRICE} PLN
                    </li>
                  )}
                </ul>

                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="w-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-black transition-all flex items-center justify-center"
                >
                  Zarezerwuj Termin
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
