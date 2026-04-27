export default function Footer() {
  return (
    <footer className="bg-[#FDF9FB] py-12 text-center border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4">
        <h4 className="text-[#C2185B] font-serif italic text-2xl mb-4">Auto do ślubu Białystok</h4>
        <p className="text-slate-500 text-xs leading-relaxed mb-6 max-w-md mx-auto">
          Ekskluzywny wynajem Mercedesa Klasy G 63 AMG wraz z kierowcą. Realizujemy transfery ślubne, przejazdy okolicznościowe i biznesowe na najwyższym poziomie.
        </p>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          &copy; {new Date().getFullYear()} VIP Transfer Białystok. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
