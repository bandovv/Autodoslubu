import { Phone } from "lucide-react";

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#FDF9FB]/90 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="text-3xl font-serif italic text-[#C2185B] tracking-tight">
          Auto do ślubu
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate-400 block ml-1 mt-[-4px]">Białystok</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("kalkulator")} className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 hover:text-[#C2185B] transition-colors">Kalkulator</button>
          <button onClick={() => scrollTo("kontakt")} className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 hover:text-[#C2185B] transition-colors">Kontakt</button>
          
          <a href="tel:+48600479905" className="flex items-center border border-pink-100 hover:bg-[#FCE4EC] text-[#C2185B] px-4 py-2 rounded-full transition-colors text-[11px] font-bold uppercase tracking-widest">
            <Phone className="w-4 h-4 mr-2" />
            +48 600 479 905
          </a>
        </div>
      </div>
    </nav>
  );
}
