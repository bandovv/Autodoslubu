import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import L from 'leaflet';
import { Calculator as CalculatorIcon, Route, Clock, ChevronRight, MapPin } from "lucide-react";
import { cn } from "../lib/utils";
import { renderToStaticMarkup } from 'react-dom/server';

const createCustomIcon = (colorClass: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative -ml-3 -mt-6">
      <MapPin className={`w-8 h-8 drop-shadow-md ${colorClass}`} fill="white" />
    </div>
  );
  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon bg-transparent border-none', // ensure no default white box
  });
};

const startIcon = createCustomIcon('text-slate-900');
const endIcon = createCustomIcon('text-[#C2185B]');

interface Point {
  lat: number;
  lng: number;
}

export default function Calculator() {
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationHours, setDurationHours] = useState<number>(5);
  const [manualDistance, setManualDistance] = useState<string>("");
  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const BASE_PRICE = 2390;
  const BASE_KM = 100;
  const BASE_HOURS = 5;
  const EXTRA_KM_PRICE = 10;
  const EXTRA_HOUR_PRICE = 200;

  useEffect(() => {
    if (startPoint && endPoint) {
      calculateRoute(startPoint, endPoint);
    } else {
      setRouteLine([]);
      if (!manualDistance) setDistanceKm(0);
    }
  }, [startPoint, endPoint]);

  const calculateRoute = async (start: Point, end: Point) => {
    setIsCalculating(true);
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distKm = route.distance / 1000;
        setDistanceKm(Math.round(distKm));
        setManualDistance(Math.round(distKm).toString());
        
        // Convert GeoJSON coords to Leaflet [lat, lng]
        const coords = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
        setRouteLine(coords);
      }
    } catch (e) {
      console.error("Route calculation failed", e);
    } finally {
      setIsCalculating(false);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!startPoint) {
          setStartPoint(e.latlng);
        } else if (!endPoint) {
          setEndPoint(e.latlng);
        } else {
          setStartPoint(e.latlng);
          setEndPoint(null);
          setRouteLine([]);
        }
      },
    });
    return null;
  };

  const resetMap = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRouteLine([]);
    setDistanceKm(parseInt(manualDistance) || 0);
  };

  const handleManualDistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualDistance(val);
    const parsed = parseInt(val);
    setDistanceKm(isNaN(parsed) ? 0 : parsed);
    if (val !== "") {
       // Clear map points if user manually types
       setStartPoint(null);
       setEndPoint(null);
       setRouteLine([]);
    }
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
          <h3 className="text-4xl md:text-5xl border-b-0 font-serif text-slate-900 italic mb-6">Kalkulator Wynajmu</h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Oblicz orientacyjny koszt wynajmu G klasy na Twój ślub. Kliknij na mapie punkt początkowy i końcowy lub wpisz dystans ręcznie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-pink-900/5 border border-pink-50">
          <div className="lg:col-span-3 h-[400px] lg:h-[500px] rounded-2xl overflow-hidden relative border border-pink-100 z-0">
             <MapContainer center={[53.1325, 23.1688]} zoom={11} className="w-full h-full" scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapClickHandler />
                {startPoint && <Marker position={startPoint} icon={startIcon}><Popup>Start</Popup></Marker>}
                {endPoint && <Marker position={endPoint} icon={endIcon}><Popup>Koniec</Popup></Marker>}
                {routeLine.length > 0 && <Polyline positions={routeLine} color="#db2777" weight={4} />}
             </MapContainer>
             
             {!startPoint && (
                <div className="absolute top-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur pointer-events-none p-3 rounded-lg shadow-md border border-slate-200 text-slate-800 font-medium text-sm text-center">
                  Kliknij na mapie, aby wybrać punkt startowy
                </div>
             )}
             {startPoint && !endPoint && (
                <div className="absolute top-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur pointer-events-none p-3 rounded-lg shadow-md border border-slate-200 text-slate-800 font-medium text-sm text-center">
                  Kliknij na mapie, aby wybrać punkt docelowy
                </div>
             )}
             {(startPoint || endPoint) && (
               <button 
                  onClick={resetMap}
                  className="absolute bottom-6 right-6 z-[400] bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg font-medium text-sm hover:bg-slate-50 transition-colors border border-slate-200"
                >
                  Resetuj mapę
                </button>
             )}
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
