import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Używamy stylowych zdjęć luxury cars / ślubnych jako placeholderów na te,
// o których mówiłeś (jako że AI Studio ładuje własne assety, używam mocnych Unsplash z autami).
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1627409240436-1e6dcb5af1ef?q=80&w=1200&auto=format&fit=crop", // Dekoracje / Ślubne 1
  "https://images.unsplash.com/photo-1549419163-fdfab5b00c3b?q=80&w=1200&auto=format&fit=crop", // Ślubne 2
  "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop", // G-Class 1
  "https://images.unsplash.com/photo-1533558701576-23c65e0272fb?q=80&w=1200&auto=format&fit=crop", // G-Class 2
  "https://images.unsplash.com/photo-1627409240367-932cf3cecb90?q=80&w=1200&auto=format&fit=crop", // Detale
  "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop", 
];

export default function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section id="galeria" className="py-24 bg-white border-b border-pink-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#C2185B] mb-3">Galeria Zdjęć</h2>
           <h3 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Królewskie Wejście</h3>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={scrollLeft}
             className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FCE4EC] text-[#C2185B] hover:bg-pink-200 transition-colors"
           >
             <ChevronLeft className="w-5 h-5" />
           </button>
           <button 
             onClick={scrollRight}
             className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FCE4EC] text-[#C2185B] hover:bg-pink-200 transition-colors"
           >
             <ChevronRight className="w-5 h-5" />
           </button>
        </div>
      </div>
      
      <div className="pl-4 sm:pl-6 lg:pl-16">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {GALLERY_IMAGES.map((img, idx) => (
             <div 
               key={idx} 
               className="shrink-0 w-[85vw] sm:w-[45vw] md:w-[32vw] aspect-[4/3] snap-start overflow-hidden rounded-3xl border border-pink-50 shadow-xl shadow-pink-900/5 group cursor-grab active:cursor-grabbing"
             >
               <img 
                 src={img} 
                 alt={`Galeria ${idx + 1}`} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
               />
             </div>
          ))}
        </div>
      </div>
    </section>
  )
}
