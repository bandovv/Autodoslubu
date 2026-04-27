import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gklasa1 from "../assets/gallery/gklasa-1.png";
import gklasa2 from "../assets/gallery/gklasa-2.png";
import gklasa3 from "../assets/gallery/gklasa-3.png";
import gklasa4 from "../assets/gallery/gklasa-4.png";
import gklasa5 from "../assets/gallery/gklasa-5.png";
import gklasa6 from "../assets/gallery/gklasa-6.png";
import gklasa7 from "../assets/gallery/gklasa-7.png";
import gklasa8 from "../assets/gallery/gklasa-8.png";
import gklasa9 from "../assets/gallery/gklasa-9.png";
import gklasa10 from "../assets/gallery/gklasa-10.png";

const GALLERY_IMAGES = [
  gklasa1,
  gklasa2,
  gklasa3,
  gklasa4,
  gklasa5,
  gklasa6,
  gklasa7,
  gklasa8,
  gklasa9,
  gklasa10,
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
           <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Galeria zdjęć</h2>
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
               className="shrink-0 w-[85vw] sm:w-[45vw] md:w-[32vw] aspect-[4/3] snap-start overflow-hidden rounded-3xl border border-pink-50 shadow-xl shadow-pink-900/5 group cursor-zoom-in bg-white flex items-center justify-center"
             >
               <img 
                 src={img} 
                 alt={`Galeria ${idx + 1}`} 
                 className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-700 ease-in-out" 
               />
             </div>
          ))}
        </div>
      </div>
    </section>
  )
}
