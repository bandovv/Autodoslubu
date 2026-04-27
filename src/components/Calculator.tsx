import { useMemo, useState } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { Route, Clock, ChevronRight, Plus, Trash2 } from "lucide-react";

export default function Calculator() {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [stops, setStops] = useState<string[]>([""]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const calculateRoute = async () => {
    if (!startAddress.trim() || !endAddress.trim()) {
      setRouteError("Podaj adres startowy i docelowy.");
      return;
    }

    if (!window.google?.maps) {
      setRouteError("Google Maps nie załadowało się poprawnie.");
      return;
    }

    setIsCalculating(true);
    setRouteError("");

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const waypoints = stops
        .map((stop) => stop.trim())
        .filter(Boolean)
        .map((location) => ({ location, stopover: true }));

      const result = await directionsService.route({
        origin: startAddress.trim(),
        destination: endAddress.trim(),
        waypoints,
        optimizeWaypoints: false,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      const totalMeters =
        result.routes[0]?.legs?.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0) || 0;
      const km = Math.round(totalMeters / 1000);

      setDirections(result);
      setDistanceKm(km);
      setManualDistance(String(km));
    } catch (error) {
      console.error("Directions calculation failed", error);
      setRouteError("Nie udało się wyznaczyć trasy. Sprawdź adresy i spróbuj ponownie.");
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
    setDirections(null);
    setRouteError("");
    setDistanceKm(parseInt(manualDistance) || 0);
  };

  const handleManualDistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualDistance(val);
    const parsed = parseInt(val);
    setDistanceKm(isNaN(parsed) ? 0 : parsed);
    if (val !== "") setDirections(null);
  };

  const calculateTotal = () => {
    const extraKm = Math.max(0, distanceKm - BASE_KM);
    const extraHours = Math.max(0, durationHours - BASE_HOURS);

    return BASE_PRICE + (extraKm * EXTRA_KM_PRICE) + (extraHours * EXTRA_HOUR_PRICE);
  };

  return (
    <section id="kalkulator" className="py-24 bg-[#FDF9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#C2185B] text-[11px] font-bold uppercase tracking-widest mb-3">Wycena Przejazdu</h2>
          <h3 className="text-4xl md:text-5xl border-b-0 font-serif text-slate-900 italic mb-6">Wycena Wynajmu</h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Wyznacz trasę w Google Maps: start, przystanki pośrednie i cel. Dystans policzy się automatycznie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-pink-900/5 border border-pink-50">
          <div className="lg:col-span-3 rounded-2xl border border-pink-100 bg-[#FDF9FB] p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
                placeholder="Start (np. Białystok, ul. Lipowa 1)"
                className="w-full px-4 py-3 rounded-lg border border-pink-100 bg-white text-sm outline-none focus:ring-1 focus:ring-pink-400 transition-all text-slate-800"
              />

              {stops.map((stop, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={stop}
                    onChange={(e) => updateStop(idx, e.target.value)}
                    placeholder={`Przystanek ${idx + 1} (opcjonalnie)`}
                    className="w-full px-4 py-3 rounded-lg border border-pink-100 bg-white text-sm outline-none focus:ring-1 focus:ring-pink-400 transition-all text-slate-800"
                  />
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

              <input
                type="text"
                value={endAddress}
                onChange={(e) => setEndAddress(e.target.value)}
                placeholder="Cel (np. Białystok, Rynek Kościuszki)"
                className="w-full px-4 py-3 rounded-lg border border-pink-100 bg-white text-sm outline-none focus:ring-1 focus:ring-pink-400 transition-all text-slate-800"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={calculateRoute}
                  disabled={isCalculating || !isLoaded}
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
              {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                <p className="text-xs text-amber-700">
                  Ustaw `VITE_GOOGLE_MAPS_API_KEY` w `.env`, aby aktywować mapę Google i trasowanie.
                </p>
              )}
            </div>

            <div className="h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-pink-100 bg-white">
              {isLoaded && import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={mapCenter}
                  zoom={11}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-center text-sm text-slate-500 px-6">
                  Mapa Google będzie widoczna po dodaniu klucza API.
                </div>
              )}
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
                    onChange={(e) => setDurationHours(parseInt(e.target.value))}
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
                <div className="text-4xl md:text-5xl font-serif text-white mb-4">{calculateTotal().toLocaleString('pl-PL')} <span className="text-[10px] font-sans opacity-70 uppercase tracking-widest">PLN</span></div>
                
                <ul className="text-xs text-white/90 font-mono space-y-2 mb-6 opacity-80">
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 text-pink-300 mr-2" /> Baza (do 100km, 5h): {BASE_PRICE} PLN</li>
                  {distanceKm > BASE_KM && <li className="flex items-center"><ChevronRight className="w-4 h-4 text-pink-300 mr-2" /> Dodatkowe {distanceKm - BASE_KM} km: {(distanceKm - BASE_KM) * EXTRA_KM_PRICE} PLN</li>}
                  {durationHours > BASE_HOURS && <li className="flex items-center"><ChevronRight className="w-4 h-4 text-pink-300 mr-2" /> Dodatkowe {durationHours - BASE_HOURS} h: {(durationHours - BASE_HOURS) * EXTRA_HOUR_PRICE} PLN</li>}
                </ul>

                <button className="w-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-black transition-all flex items-center justify-center">
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
