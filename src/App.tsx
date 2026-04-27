/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Calculator from "./components/Calculator";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDF9FB] text-slate-800 font-sans selection:bg-pink-500/30 selection:text-[#C2185B]">
      <Navbar />
      <Hero />
      <Gallery />
      <Calculator />
      <Contact />
      <Testimonials />
      <Footer />
    </div>
  );
}
