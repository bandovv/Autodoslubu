import { useEffect, useRef, useState, type ReactNode } from "react";
import { MapPin, Loader2 } from "lucide-react";

type NominatimAddress = {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  path?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  city_district?: string;
  suburb?: string;
  hamlet?: string;
};

export type NominatimHit = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: NominatimAddress;
};

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <strong key={i} className="font-semibold text-slate-900">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function formatHit(hit: NominatimHit): { primary: string; secondary: string } {
  const a = hit.address ?? {};
  const street = [a.road, a.pedestrian, a.path].find(Boolean);
  const nr = a.house_number;
  let primary = [street, nr].filter(Boolean).join(" ").trim() || (hit.name?.trim() ?? "");

  const place =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.city_district ||
    a.suburb ||
    a.hamlet ||
    "";

  if (!primary) {
    primary = hit.display_name.split(",")[0]?.trim() || hit.display_name;
  }

  const secondary =
    place ||
    hit.display_name
      .split(",")
      .slice(1, 4)
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");

  return { primary, secondary };
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const DEBOUNCE_MS = 450;
const MIN_QUERY_LEN = 3;

export default function AddressAutocomplete({ value, onChange, placeholder, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<NominatimHit[]>([]);

  useEffect(() => {
    const q = value.trim();
    if (q.length < MIN_QUERY_LEN) {
      setHits([]);
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&limit=6&countrycodes=pl&addressdetails=1`;
        const res = await fetch(url, {
          signal: ctrl.signal,
          headers: { "Accept-Language": "pl,en;q=0.9" },
        });
        if (!res.ok) {
          setHits([]);
          return;
        }
        const data = (await res.json()) as NominatimHit[];
        setHits(Array.isArray(data) ? data : []);
      } catch {
        if (!ctrl.signal.aborted) setHits([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const showList = open && value.trim().length >= MIN_QUERY_LEN && (hits.length > 0 || loading);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (value.trim().length >= MIN_QUERY_LEN) setOpen(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-4 py-3 rounded-lg border border-pink-100 bg-white text-sm outline-none focus:ring-1 focus:ring-pink-400 transition-all text-slate-800"
      />

      {showList && (
        <ul
          className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-64 overflow-auto rounded-xl border border-pink-100 bg-white py-1 shadow-xl shadow-pink-900/10"
          role="listbox"
        >
          {loading && hits.length === 0 && (
            <li className="flex items-center gap-2 px-3 py-2.5 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              Szukam adresów…
            </li>
          )}
          {hits.map((hit) => {
            const { primary, secondary } = formatHit(hit);
            return (
              <li key={hit.place_id} role="option">
                <button
                  type="button"
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-[#FCE4EC]/60 transition-colors"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(hit.display_name);
                    setOpen(false);
                  }}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-slate-900 leading-snug">
                      {highlightMatch(primary || hit.display_name, value)}
                    </span>
                    {secondary ? (
                      <span className="block text-xs text-slate-500 mt-0.5 leading-snug">{secondary}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
          {!loading && hits.length === 0 && value.trim().length >= MIN_QUERY_LEN && (
            <li className="px-3 py-2.5 text-xs text-slate-500">Brak wyników — spróbuj dopisać miejscowość.</li>
          )}
        </ul>
      )}
    </div>
  );
}
