import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
// Ubah ConnectButton di sini untuk menggunakan custom label
import { ConnectButton } from "thirdweb/react"; 
import { client } from "./api/thirdweb";
import { sepolia } from "thirdweb/chains";

import Navbar from "./components/Navbar";
import Aurora from "./components/ui/Aurora";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { CampaignsPage } from "./pages/CampaignPage";
import { CreateCampaign } from "./pages/CreateCampaign";
import { CampaignDetails } from "./pages/CampaignDetail";
import { Wallet } from "lucide-react"; // Import ikon Wallet

const pageVariants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

export function App() {
  const location = useLocation();

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Tentang Kami", href: "/about" },
    { label: "Kampanye", href: "/campaigns" },
    { label: "Buat Kampanye", href: "/create" },
  ];

  // 1. Buat elemen ikon dompet
  const walletIcon = <Wallet className="w-5 h-5 mr-2 inline-block" />;

  // 2. Komponen tombol ConnectButton yang akan digunakan di beberapa tempat
  const connectButton = (
    <ConnectButton
      client={client}
      chain={sepolia}
      connectButton={{
        // **REVISI DI SINI:** Sisipkan ikon di dalam label
        label: (
          <span className="flex items-center justify-center">
            {walletIcon}
            Hubungkan Dompet
          </span>
        ),
        className: "px-4 py-2 w-full text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-bold shadow-md transition-transform duration-200 hover:scale-105",
      }}
    />
  );

  return (
    <div className="relative text-white min-h-screen font-sans flex flex-col items-center p-4 sm:p-8">
      {/* Aurora component as the background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Kontainer untuk Navbar dan tombol koneksi di desktop */}
      <div className="w-full max-w-7xl flex justify-between items-center relative z-50">
        {/* Menggunakan Navbar dan meneruskan tombol ConnectButton sebagai prop */}
        <Navbar
          logo="./src/GotongChain.png"
          items={navItems}
          activeHref={location.pathname}
          connectButton={connectButton} // Teruskan tombol ke komponen Navbar
        />

        {/* Tombol koneksi untuk tampilan desktop.
            Hidden on mobile (md:hidden), visible on medium and larger screens. */}
        <div className="hidden md:flex ml-auto">
          {connectButton}
        </div>
      </div>
      
      {/* Konten halaman */}
      <div className="w-full max-w-7xl mt-8 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                >
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/about"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                >
                  <About />
                </motion.div>
              }
            />
            <Route
              path="/campaigns"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                >
                  <CampaignsPage />
                </motion.div>
              }
            />
            <Route
              path="/create"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                >
                  <CreateCampaign />
                </motion.div>
              }
            />
            <Route
              path="/campaigns/:id"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                >
                  <CampaignDetails />
                </motion.div>
              }
            />
            <Route path="*" element={<p className="text-center text-red-400 text-lg">Halaman tidak ditemukan.</p>} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}