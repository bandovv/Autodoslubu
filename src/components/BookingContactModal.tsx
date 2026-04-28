import { useEffect } from "react";
import { X, Phone, Mail } from "lucide-react";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "../contactInfo";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BookingContactModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-pink-100 bg-white p-6 shadow-2xl shadow-pink-900/15 md:p-10 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-[#FCE4EC] hover:text-[#C2185B] transition-colors"
          aria-label="Zamknij"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="booking-modal-title"
          className="pr-10 text-center text-2xl md:text-3xl font-bold text-slate-900 leading-snug"
        >
          Sprawdź dostępność i zarezerwuj termin!
        </h2>

        <p className="mt-5 text-center text-base text-slate-800 font-medium leading-relaxed">
          Zachęcamy do kontaktu telefonicznego, SMS-owego lub mailowego. Szukasz terminu na już? Zadzwoń koniecznie!
          Cały czas przyjmujemy zapisy i często mamy jeszcze ostatnie wolne miejsca na najbliższe dni. Czekamy na Twój
          telefon!
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <a
            href={CONTACT_PHONE_TEL}
            className="flex min-h-[3.25rem] w-full items-center justify-center gap-3 rounded-xl border-2 border-pink-200 bg-[#FDF9FB] px-5 py-3 text-lg md:text-xl font-semibold tabular-nums tracking-tight text-slate-900 hover:bg-[#FCE4EC] transition-colors whitespace-nowrap overflow-x-auto"
          >
            <Phone className="h-6 w-6 shrink-0 text-[#C2185B]" aria-hidden />
            {CONTACT_PHONE_DISPLAY}
          </a>
          <a
            href={CONTACT_MAILTO}
            className="flex min-h-[3.25rem] w-full items-center justify-center gap-3 rounded-xl border-2 border-pink-200 bg-[#FDF9FB] px-5 py-3 text-lg md:text-xl font-semibold text-slate-900 hover:bg-[#FCE4EC] transition-colors whitespace-nowrap overflow-x-auto font-mono tracking-wide"
            title="Adres zwykłą literą l (el), bez polskiego ł — bialystok"
          >
            <Mail className="h-6 w-6 shrink-0 text-[#C2185B]" aria-hidden />
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
