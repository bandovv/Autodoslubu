import { ChevronDown, Check } from "lucide-react";
import { VEHICLE_SPECS } from "../data";
import heroImage from "../assets/gallery/hero-main.png";
import heroSideImage from "../assets/gallery/hero-side.png";

export default function Hero() {
  const scrollToKalkulator = () => {
    document.getElementById("kalkulator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 bg-[#FDF9FB] overflow-hidden">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[#FDF9FB]/90 z-10" />
         <img
            src={heroImage}
            alt="Mercedes G Klasa AMG"
            className="w-full h-full object-cover object-center opacity-30 grayscale"
         />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full block lg:flex items-center justify-between gap-12">
        <div className="max-w-3xl flex-1 pt-12 lg:pt-0">
          <div className="inline-flex items-center px-3 py-1 bg-[#FCE4EC] text-[#AD1457] text-[10px] font-bold uppercase tracking-widest rounded-full italic border-0 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#AD1457] mr-2 animate-pulse" />
            WOLNE TERMINY 2026/2027
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif leading-[0.95] text-slate-900 mb-6">
            Mercedes-Benz <br className="hidden md:block" />
            <span className="text-[#C2185B] italic font-light">Klasa G 63 AMG</span>
          </h1>

          <div className="inline-block bg-white border border-pink-50 rounded-[2rem] p-6 mb-10 shadow-xl shadow-pink-900/5">
             <ul className="space-y-4">
                <li className="flex items-start">
                   <div className="mt-1 bg-[#FCE4EC] p-1 rounded-full mr-3 border border-pink-100">
                     <Check className="w-3 h-3 text-[#C2185B]" />
                   </div>
                   <span className="text-slate-600">
                     <strong className="text-slate-900 font-serif">V8 biturbo 4.0L (benzyna) · 585 KM</strong>
                   </span>
                </li>
                <li className="flex items-start">
                   <div className="mt-1 bg-[#FCE4EC] p-1 rounded-full mr-3 border border-pink-100">
                     <Check className="w-3 h-3 text-[#C2185B]" />
                   </div>
                   <span className="text-slate-600">
                     <strong className="text-slate-900 font-serif">850 Nm · przyspieszenie 0-100 km/h ~4,5 s</strong>
                   </span>
                </li>
             </ul>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 mb-10 pb-10 border-b border-pink-100">
             {VEHICLE_SPECS.map((spec, idx) => (
                <div key={idx}>
                   <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">{spec.label}</div>
                   <div className={idx === 2 ? "text-[#C2185B] font-serif text-lg" : "text-slate-900 font-serif text-lg"}>{spec.value}</div>
                </div>
             ))}
          </div>

          <div>
             <p className="max-w-md text-sm text-slate-500 leading-relaxed mb-10">
               <strong className="text-[#C2185B]">VIP Transfer Białystok</strong> oferuje przewozy pasażerskie w modelu z pełną obsługą przewoźnika, zgłoszenie przewozu oraz standardy bezpieczeństwa są uwzględnione w ramach usługi.
             </p>

             <button 
                onClick={scrollToKalkulator}
                className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest py-4 px-8 rounded-lg hover:bg-black transition-all flex items-center shadow-xl shadow-pink-900/5"
              >
                Przejdź do wyceny
                <ChevronDown className="ml-2 w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Optional Right Side Image Overlay if we want a clearer picture of the car */}
        <div className="hidden lg:block w-[450px] shrink-0 mt-12 lg:mt-0 relative">
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 rounded-2xl" />
             <img
                src={heroSideImage}
                alt="AMG G63 Front"
                className="w-full h-auto rounded-2xl border-4 border-white shadow-xl object-cover aspect-[4/5] scale-x-[-1]"
             />
        </div>
      </div>
    </section>
  );
}
