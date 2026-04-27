import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data";

export default function Testimonials() {
  return (
    <section className="py-24 bg-white border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#C2185B] mb-3">Doświadczenia</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Co Mówią Nasi Klienci</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-[#AD1457]">
               {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Średnia ocen 5.0/5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-[#FDF9FB] border border-pink-50 rounded-[2rem] p-8 shadow-xl shadow-pink-900/5 transition-all relative group hover:-translate-y-1">
              <Quote className="absolute top-8 right-8 w-12 h-12 text-pink-100 group-hover:text-pink-200 transition-colors" />
              <div className="flex text-[#AD1457] mb-6">
                 {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-600 mb-8 italic text-sm leading-relaxed">"{t.text}"</p>
              <div className="pt-6 border-t border-pink-50 mt-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
