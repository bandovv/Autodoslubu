import { Phone, Mail } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "../contactInfo";

export default function Contact() {
  return (
    <section id="kontakt" className="py-24 bg-white border-t border-pink-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FCE4EC]/30"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center font-sans">
        <h2 className="text-[#C2185B] text-[11px] font-bold uppercase tracking-widest mb-4">Indywidualna Wycena</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-snug mb-8">
          Potrzebujesz oferty szytej na miarę?
        </h3>

        <p className="max-w-xl mx-auto text-base text-slate-800 font-medium leading-relaxed mb-12">
          Planujesz nietypowy przejazd, trasę z wieloma przystankami albo sesję zdjęciową z autem w tle? Napisz lub zadzwoń — przygotujemy indywidualną wycenę dopasowaną do Twojego scenariusza. Każdą ofertę liczymy w oparciu o licencjonowany przewóz osób.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a
            href={CONTACT_PHONE_TEL}
            className="flex items-center w-full sm:w-auto bg-white hover:bg-[#FDF9FB] border border-pink-100 shadow-sm shadow-pink-900/5 p-6 rounded-2xl transition-all group"
          >
            <div className="bg-[#FCE4EC]/50 rounded-full p-4 mr-5 group-hover:bg-pink-100 transition-colors">
              <Phone className="w-6 h-6 text-[#C2185B]" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-slate-600 text-[11px] font-bold uppercase tracking-widest mb-1">Telefon</div>
              <div className="text-slate-900 text-xl font-semibold tabular-nums tracking-tight font-sans whitespace-nowrap">
                {CONTACT_PHONE_DISPLAY}
              </div>
            </div>
          </a>

          <a
            href={CONTACT_MAILTO}
            className="flex items-center w-full sm:w-auto bg-white hover:bg-[#FDF9FB] border border-pink-100 shadow-sm shadow-pink-900/5 p-6 rounded-2xl transition-all group"
          >
            <div className="bg-[#FCE4EC]/50 rounded-full p-4 mr-5 group-hover:bg-pink-100 transition-colors">
              <Mail className="w-6 h-6 text-[#C2185B]" />
            </div>
            <div className="text-left min-w-0 overflow-x-auto">
              <div className="text-slate-600 text-[11px] font-bold uppercase tracking-widest mb-1">E-mail</div>
              <div
                className="text-slate-900 text-lg sm:text-xl font-semibold font-mono tracking-wide whitespace-nowrap"
                title="Adres zwykłą literą l (el), bez polskiego ł"
              >
                {CONTACT_EMAIL}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
