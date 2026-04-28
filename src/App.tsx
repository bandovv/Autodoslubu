/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Calculator from "./components/Calculator";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BookingContactModal from "./components/BookingContactModal";

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDF9FB] text-slate-800 font-sans selection:bg-pink-500/30 selection:text-[#C2185B]">
      <Navbar onOpenBooking={() => setBookingOpen(true)} />
      <Hero />
      <Gallery />
      <Calculator onOpenBooking={() => setBookingOpen(true)} />
      <Contact />
      <Testimonials />
      <Footer />
      <BookingContactModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
